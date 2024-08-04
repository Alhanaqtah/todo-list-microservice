import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { Col } from 'src/columns/column.model';

@Injectable()
export class TasksService {
    constructor(@InjectRepository(Task) private taskRepo: Repository<Task>,
                @InjectRepository(Col) private columnRepo: Repository<Col>) {}
    
    async create(taskDto: CreateTaskDto) {
        const found = await this.taskRepo.findOne({where: {title: taskDto.title}});
        if (found) {
            throw new HttpException('Task already exists', HttpStatus.CONFLICT);
        }

        const task = this.taskRepo.create(taskDto);
        
        const column = await this.columnRepo.findOne({where: {id: taskDto.columnId}, relations: ['tasks']});
        if (!column) {
            throw new HttpException('Column not found', HttpStatus.NOT_FOUND);
        }

        task.column = column;
        task.order = column.tasks.length + 1;

        const t =  await this.taskRepo.save(task);

        delete task.column;

        return t;
    }

    async read(taskId: string) {
        return await this.taskRepo.findOneBy({id: taskId});
    }

    async update(taskId: any, taskDto: UpdateTaskDto) {
        await this.taskRepo.update({id: taskId}, {...taskDto});
        return await this.taskRepo.findOneBy({title: taskDto.title});
    }

    async remove(resourceId: string) {
        await this.taskRepo.delete({ id: resourceId});
    }

    async move(taskId: string, taskDto: MoveTaskDto) {
        const taskToMove = await this.taskRepo.findOne({ where: { id: taskId }, relations: ['column'] });
        if (!taskToMove) {
            throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
        }
        
        const column = await this.columnRepo.findOne({ where: { id: taskDto.columnId }, relations: ['tasks'] });
        if (!column) {
            throw new HttpException('Column not found', HttpStatus.NOT_FOUND);
        }

        const tasks = column.tasks.sort((a, b) => a.order - b.order);

        if (taskDto.newOrder < 1 || (taskDto.newOrder > tasks.length && tasks.length > 1)) {
            throw new HttpException("Invalid value of new tasks's order", HttpStatus.BAD_REQUEST);
        }

        // Проверяем, изменяется ли колонка задачи
        if (taskDto.columnId !== taskToMove.column.id) {
            taskToMove.column = column;
        }

        // Удаление задачи из текущего списка задач
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
        }

        // Вставляем задачу в новую позицию
        tasks.splice(taskDto.newOrder - 1, 0, taskToMove);

        // Обновление порядка задач в транзакции
        await this.columnRepo.manager.transaction(async (transactionalEntityManager: EntityManager) => {
            // Обновляем порядок всех задач в колонке
            for (let i = 0; i < tasks.length; i++) {
                await transactionalEntityManager.update('Task', { id: tasks[i].id }, { order: i + 1, column: tasks[i].column });
            }
        });

        // Вернуть обновленные данные проекта
        const updatedColumn = await this.columnRepo.findOne({
            where: { id: taskDto.columnId },
            relations: ['tasks']
        });
    
        if (!updatedColumn) {
            throw new Error('Updated project not found');
        }
    
        return updatedColumn.tasks;
    }
}
