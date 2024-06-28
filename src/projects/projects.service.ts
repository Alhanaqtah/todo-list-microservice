import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Project } from './project.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UsersService } from 'src/users/users.service';
import { title } from 'process';

@Injectable()
export class ProjectsService {
    constructor(@InjectRepository(Project) private projectRepo: Repository<Project>,
                private userService: UsersService) {}

    async create(user: any, projectDto: CreateProjectDto) {
        if (!user || !user.sub) {
            throw new HttpException('Invalid user data', HttpStatus.BAD_REQUEST);
        }

        const found = await this.findProjectByTitle(projectDto.title);
        if (found) {
            throw new HttpException('Project already exists', HttpStatus.CONFLICT);
        }

        const usr = await this.userService.findUserByID(user.sub);

        const prj = this.projectRepo.create({...projectDto, user: usr});

        const project = await this.projectRepo.save(prj);

        delete project.user;

        return project;
    }

    async find(id: string) {
        const project = this.projectRepo.findOne({where: {id}, relations: {
            user: false,
            lists: true,
        }});
        return project;
    }

    async update(projectId: string, projectDto: CreateProjectDto) {
        await this.projectRepo.createQueryBuilder()
        .update('projects')
        .set({title: projectDto.title, description: projectDto.description})
        .where("id = :id", { id: projectId })
        .execute();

        return await this.findOwnerById(projectId);
    }
    
    async findProjectByTitle(title: string) {
        const project = await this.projectRepo.findOne({where: {title}, relations: ['lists']})
        return project;
    }

    async findOwnerById(id: string) {
        const user = await this.projectRepo.findOne({where: {id}, relations: ['lists']})
        return user;
    }
}
