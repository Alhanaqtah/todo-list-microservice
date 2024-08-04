import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Project } from './project.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
    constructor(@InjectRepository(Project) private projectRepo: Repository<Project>) {}

    async create(user: any, projectDto: CreateProjectDto) {
        const found = await this.findProjectByTitle(projectDto.title);
        if (found) {
            throw new HttpException('Project already exists', HttpStatus.CONFLICT);
        }

        const prj = this.projectRepo.create({...projectDto, user_id: user.sub});

        const project = await this.projectRepo.save(prj);

        delete project.user_id;

        return project;
    }

    async find(id: string) {
        const project = await this.projectRepo.findOne({where: {id}, relations: ['columns', 'columns.tasks']});
        project.columns.sort((a, b) => a.order - b.order);
        project.columns.forEach(column => column.tasks.sort((a, b) => a.order - b.order));
        return project;
    }

    async update(projectId: string, projectDto: CreateProjectDto) {
        console.debug("id", projectId)
        console.debug(await this.projectRepo.update({id: projectId}, {title: projectDto.title, description: projectDto.description}));
        return await this.findProjectById(projectId);
    }

    async remove(projectId: string) {
        await this.projectRepo.delete(projectId);
    }
    
    async findProjectByTitle(title: string) {
        const project = await this.projectRepo.findOne({where: {title}})
        return project;
    }

    async findProjectById(id: string) {
        const user = await this.projectRepo.findOne({where: {id}, relations: ['columns', 'columns.tasks']})
        return user;
    }

    async handleRemoveUserData(id: string) {
        await this.projectRepo.delete({user_id: id});
    }
}
