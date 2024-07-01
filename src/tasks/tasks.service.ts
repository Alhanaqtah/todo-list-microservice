import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { ColumnsService } from 'src/columns/columns.service';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
    constructor(@InjectRepository(Task) private taskRepo: Repository<Task>,
                private columnService: ColumnsService) {}
    
    async create(taskDto: CreateTaskDto) {
        const found = await this.getTaskByTitle(taskDto.title);
        if (found) {
            throw new HttpException('Task already exists', HttpStatus.CONFLICT);
        }

        const task = this.taskRepo.create(taskDto);
        
        const column = await this.columnService.getColumnById(taskDto.columnId);
        if (!column) {
            throw new HttpException('Column not found', HttpStatus.NOT_FOUND);
        }

        task.column = column;
        
        const t =  await this.taskRepo.save(task);

        delete task.column;

        return t;
    }

    async read(taskId: string) {
        return await this.taskRepo.findOneBy({id: taskId});
    }

    async update(taskId: any, taskDto: UpdateTaskDto) {
        await this.taskRepo.update({id: taskId}, {title: taskDto.title, description: taskDto.description});
        return await this.getTaskByTitle(taskDto.title);
    }

    async remove(resourceId: string) {
        await this.taskRepo.delete({ id: resourceId});
    }

    async getTaskByTitle(taskTiele: string) {
        const task = await this.taskRepo.findOneBy({title: taskTiele});
        return task;
    }
}
