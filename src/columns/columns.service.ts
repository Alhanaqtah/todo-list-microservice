import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { Col } from "./column.model";
import { CreateColumnDto } from "./dto/create-column.dto";
import { Project } from "src/projects/project.model";

@Injectable()
export class ColumnsService {
    constructor(
        @InjectRepository(Col) private columnRepo: Repository<Col>,
        @InjectRepository(Project) private projectRepo: Repository<Project>,
    ){}

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
        const found = await this.columnRepo.findOneBy({id: columnId});
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
        await this.columnRepo.delete({ id: columnId });
        return;
    }

    async moveColumn(columnId: string, newOrder: number): Promise<Col[]> {
        const columnToMove = await this.columnRepo.findOne({ where: { id: columnId }, relations: ['project'] });
        if (!columnToMove) {
            throw new Error('Column not found');
        }
    
        const project = await this.projectRepo.findOne({ where: { id: columnToMove.project.id }, relations: ['columns'] });
        if (!project) {
            throw new Error('Project not found');
        }
    
        const columns = project.columns.sort((a, b) => a.order - b.order);
    
        // Валидация newOrder
        if (newOrder < 1 || newOrder > columns.length) {
            throw new HttpException("Invalid value of new column's order", HttpStatus.BAD_REQUEST);
        }
    
        // Извлечение колонки из текущего места
        const columnIndex = columns.findIndex(col => col.id === columnId);
        const [column] = columns.splice(columnIndex, 1);
    
        // Вставка колонки в новую позицию
        columns.splice(newOrder - 1, 0, column);
    
        // Выполнение обновления в транзакции
        await this.columnRepo.manager.transaction(async (transactionalEntityManager: EntityManager) => {
            // Установить временные значения, которые гарантированно уникальны
            const tempOrderValues = columns.map((col, index) => ({ id: col.id, order: -index }));
    
            // Применить временные значения order
            for (let tempOrder of tempOrderValues) {
                await transactionalEntityManager.update('Col', { id: tempOrder.id }, { order: tempOrder.order });
            }
    
            // Обновление окончательного значения order
            for (let i = 0; i < columns.length; i++) {
                await transactionalEntityManager.update('Col', { id: columns[i].id }, { order: i + 1 });
            }
        });
    
        // Вернуть обновленные данные проекта
        const updatedProject = await this.projectRepo.findOne({
            where: { id: project.id },
            relations: ['columns']
        });
    
        if (!updatedProject) {
            throw new Error('Updated project not found');
        }
    
        return updatedProject.columns;
    }

    async getColumnByTitle(title: string) {
        const column = await this.columnRepo.findOneBy({ title: title });
        return column;
    }
}
