import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Col } from './column.model';
import { CreateColumnDto } from './dto/create-column.dto';

@Injectable()
export class ColumnsService {
    constructor(@InjectRepository(Col) private columnRepo: Repository<Col>) {}

    async create(columnDto: CreateColumnDto) {
        const found = await this.getColumnByTitle(columnDto.title);
        if (found) {
            throw new HttpException('Column already exists', HttpStatus.CONFLICT);
        }

        const count = (await this.columnRepo.findBy({project: {id: columnDto.projectId}})).length;

        const column = this.columnRepo.create({...columnDto, order: count + 1});

        return await this.columnRepo.save({...column, project: {id: columnDto.projectId}});
    }

    async read(columnId: string) {
        const column = await this.columnRepo.findOne({where: {id: columnId}});
        return column;
    }

    async getColumnByTitle(title: string) {
        const column = await this.columnRepo.findOneBy({title: title});
        return column;
    }
}
