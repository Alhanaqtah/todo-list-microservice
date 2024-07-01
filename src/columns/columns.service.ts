import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Col } from "./column.model";
import { CreateColumnDto } from "./dto/create-column.dto";
import { Project } from "src/projects/project.model";
import { resolveSoa } from "dns";

@Injectable()
export class ColumnsService {
    constructor(
        @InjectRepository(Col) private columnRepo: Repository<Col>,
        @InjectRepository(Project) private projectRepo: Repository<Project>,
        private dataSource: DataSource
    ) { }

    async create(columnDto: CreateColumnDto) {
        const found = await this.getColumnByTitle(columnDto.title);
        if (found) {
            throw new HttpException("Column already exists", HttpStatus.CONFLICT);
        }

        const count = (
            await this.columnRepo.findBy({ project: { id: columnDto.projectId } })
        ).length;

        const column = this.columnRepo.create({ ...columnDto, order: count + 1 });

        const newColumn = await this.columnRepo.save({
            ...column,
            project: { id: columnDto.projectId },
        });

        delete newColumn.project;

        return newColumn;
    }

    async read(columnId: string) {
        const column = await this.columnRepo.findOne({ where: { id: columnId } });
        return column;
    }

    async update(columnId: string, columnDto: CreateColumnDto) {
        const found = await this.getColumnById(columnId);
        if (!found) {
            throw new HttpException("Column not found", HttpStatus.NOT_FOUND);
        }

        const res = await this.columnRepo
            .createQueryBuilder()
            .update("columns")
            .set({ title: columnDto.title })
            .where("id = :id", { id: columnId })
            .execute();

        return await this.getColumnByTitle(columnDto.title);
    }

    async remove(columnId: string) {
        const found = await this.getColumnById(columnId);
        if (!found) {
            throw new HttpException("Column not found", HttpStatus.NOT_FOUND);
        }

        await this.columnRepo.delete({ id: columnId });

        return;
    }

    async moveColumn(columnId: string, newOrder: number) {
        const queryRunner = this.columnRepo.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const columnRepository = queryRunner.manager.getRepository(Col);
            const projectRepository = queryRunner.manager.getRepository(Project);

            const columnToMove = await columnRepository.findOne({ where: { id: columnId }, relations: ['project'] });
            if (!columnToMove) {
                throw new HttpException('Column not found', HttpStatus.NOT_FOUND);
            }

            const project = await projectRepository.findOne({
                where: { id: columnToMove.project.id },
                relations: ['columns']
            });

            const columns = project.columns.sort((a, b) => a.order - b.order);

            if (newOrder < 0 || newOrder >= columns.length) {
                throw new HttpException('Invalid newOrder value', HttpStatus.BAD_REQUEST);
            }

            if (newOrder === columnToMove.order) {
                return columnToMove;
            }

            const tempOrder = -1;
            await columnRepository.update({ id: columnToMove.id }, { order: tempOrder });

            // Обновляем порядок колонок между текущей и новой позицией
            if (newOrder > columnToMove.order) {
                // Если колонка перемещается вперед
                for (let i = columnToMove.order + 1; i <= newOrder; i++) {
                    const col = columns.find(column => column.order === i);
                    if (col) {
                        await columnRepository.update({ id: col.id }, { order: i - 1 });
                    }
                }
            } else {
                // Если колонка перемещается назад
                for (let i = columnToMove.order - 1; i >= newOrder; i--) {
                    const col = columns.find(column => column.order === i);
                    if (col) {
                        await columnRepository.update({ id: col.id }, { order: i + 1 });
                    }
                }
            }

            await columnRepository.update({ id: columnToMove.id }, { order: newOrder });

            await queryRunner.commitTransaction();

            return { ...columnToMove, order: newOrder };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async getColumnByTitle(title: string) {
        const column = await this.columnRepo.findOneBy({ title: title });
        return column;
    }

    async getColumnById(id: string) {
        const column = await this.columnRepo.findOneBy({ id: id });
        return column;
    }
}
