import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.model';
import { Project } from 'src/projects/project.model';
import { List } from 'src/lists/list.model';
import { Col } from 'src/columns/column.model';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [TypeOrmModule.forFeature([Task, Project, List, Col])
  ]
})
export class TasksModule {}
