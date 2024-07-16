import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.model';
import { Project } from 'src/projects/project.model';
import { Col } from 'src/columns/column.model';
import { ColumnsModule } from 'src/columns/columns.module';
import { User } from 'src/users/user.model';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [
    TypeOrmModule.forFeature([Task, Project, Col, User]),
    ColumnsModule
  ]
})
export class TasksModule {}
