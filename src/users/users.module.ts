import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.model';
import { RolesModule } from 'src/roles/roles.module';
import { Col } from 'src/columns/column.model';
import { Project } from 'src/projects/project.model';
import { Task } from 'src/tasks/task.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User, Col, Project, Task]),
    RolesModule
  ],
  exports: [UsersService]
})
export class UsersModule {}
