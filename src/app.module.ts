import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ColumnsModule } from './columns/columns.module';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';
import { User } from './users/user.model';
import { Project } from './projects/project.model';
import { Task } from './tasks/task.model';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/roles.model';
import { ListsModule } from './lists/lists.module';
import { List } from './lists/list.model';
import { Col } from './columns/column.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Project, Task, Role, List, Col],
      synchronize: true,
      autoLoadEntities: true
    }),
    AuthModule,
    UsersModule,
    ColumnsModule,
    TasksModule,
    ProjectsModule,
    RolesModule,
    ListsModule
  ],
})
export class AppModule {}
