import { Module } from '@nestjs/common';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';
import { ProjectsModule } from 'src/projects/projects.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Col } from './column.model';
import { Project } from 'src/projects/project.model';
import { Task } from 'src/tasks/task.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([Col, Project, Task]),
  ],
  controllers: [ColumnsController],
  providers: [ColumnsService],
  exports: [ColumnsService]
})
export class ColumnsModule {}
