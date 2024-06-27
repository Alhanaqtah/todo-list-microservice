import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.model';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Project]),
  ]
})
export class ProjectsModule {}
