import { Module } from '@nestjs/common';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './list.model';
import { Type } from 'class-transformer';
import { Project } from 'src/projects/project.model';
import { Col } from 'src/columns/column.model';
import { Task } from 'src/tasks/task.model';

@Module({
  controllers: [ListsController],
  providers: [ListsService],
  imports: [TypeOrmModule.forFeature([List, Project, Col, Task])]
})
export class ListsModule {}
