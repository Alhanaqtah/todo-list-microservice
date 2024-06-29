import { Module } from '@nestjs/common';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Col } from './column.model';
import { Project } from 'src/projects/project.model';
import { Task } from 'src/tasks/task.model';

@Module({
  controllers: [ColumnsController],
  providers: [ColumnsService],
  imports: [TypeOrmModule.forFeature([Col, Project, Task])]
})
export class ColumnsModule {}
