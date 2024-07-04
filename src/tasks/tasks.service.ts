import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { ColumnsService } from 'src/columns/columns.service';
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
        const queryRunner = this.taskRepo.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
    
        try {
            const taskRepository = queryRunner.manager.getRepository(Task);
            const columnRepository = queryRunner.manager.getRepository(Col);
    
            const taskToMove = await taskRepository.findOne({ where: { id: taskId }});
            if (!taskToMove) {
                throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
            }

            const column = await columnRepository.findOne({ where: { id: taskDto.columnId }, relations: ['tasks']});
            if (!column) {
                throw new HttpException('Column not found', HttpStatus.NOT_FOUND);
            }
    
            const tasks = column.tasks.sort((a, b) => a.order - b.order);
            if (tasks.length === 0) {
                await taskRepository.update({id: taskToMove.id}, {order: 1, column: column});
                return { ...taskToMove, order: 1, column: column };
            }
    
            if (taskDto.newOrder < 0 || taskDto.newOrder > tasks.length) {
                throw new HttpException('Invalid newOrder value', HttpStatus.BAD_REQUEST);
            }
    
            // Если перемещение внутри той же колонки и на то же место
            if (column.id === taskDto.columnId && taskDto.newOrder === taskToMove.order) {
                return taskToMove;
            }
    
            const tempOrder = -1;
            await taskRepository.update({ id: taskToMove.id }, { order: tempOrder });
    
            // Обновляем порядок задач в текущей колонке
            // if (currentColumn.id === newColumn.id) {
            //     if (taskDto.newOrder > taskToMove.order) {
            //         for (let i = taskToMove.order + 1; i <= taskDto.newOrder; i++) {
            //             const task = tasksInCurrentColumn.find(t => t.order === i);
            //             if (task) {
            //                 await taskRepository.update({ id: task.id }, { order: i - 1 });
            //             }
            //         }
            //     } else {
            //         for (let i = taskToMove.order - 1; i >= taskDto.newOrder; i--) {
            //             const task = tasksInCurrentColumn.find(t => t.order === i);
            //             if (task) {
            //                 await taskRepository.update({ id: task.id }, { order: i + 1 });
            //             }
            //         }
            //     }
            // } else {
            //     // Обновляем порядок задач в новой колонке
            //     for (let i = tasksInNewColumn.length - 1; i >= taskDto.newOrder; i--) {
            //         const task = tasksInNewColumn.find(t => t.order === i);
            //         if (task) {
            //             await taskRepository.update({ id: task.id }, { order: i + 1 });
            //         }
            //     }
            //     // Обновляем порядок задач в текущей колонке
            //     for (let i = taskToMove.order + 1; i <= tasksInCurrentColumn.length; i++) {
            //         const task = tasksInCurrentColumn.find(t => t.order === i);
            //         if (task) {
            //             await taskRepository.update({ id: task.id }, { order: i - 1 });
            //         }
            //     }
            // }

            if (taskDto.newOrder > taskToMove.order) {
                // Если задача перемещается вперед
                for (let i = taskToMove.order + 1; i <= taskDto.newOrder; i++) {
                    const task = tasks.find(t => t.order === i);
                    if (task) {
                        await taskRepository.update({ id: task.id }, { order: i - 1 });
                    }
                }
            } else {
                // Если задача перемещается назад
                for (let i = taskToMove.order - 1; i >= taskDto.newOrder; i--) {
                    const task = tasks.find(t => t.order === i);
                    if (task) {
                        await taskRepository.update({ id: task.id }, { order: i + 1 });
                    }
                }
            }
    
            await taskRepository.update({ id: taskToMove.id }, { order: taskDto.newOrder, column: column });
    
            await queryRunner.commitTransaction();
    
            return { ...taskToMove, order: taskDto.newOrder, column: column };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }  
}
