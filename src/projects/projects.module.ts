import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.model';
import { Col } from 'src/columns/column.model';
import { Task } from 'src/tasks/task.model';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/users/user.model';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [
    UsersModule,
    JwtModule,
    TypeOrmModule.forFeature([Project, Col, Task, User]),
  ]
})
export class ProjectsModule {}
