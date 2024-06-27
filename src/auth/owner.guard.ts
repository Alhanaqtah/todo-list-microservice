import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "src/projects/project.model";
import { ProjectsService } from "src/projects/projects.service";
import { Repository } from "typeorm";

@Injectable()
export class OwnerGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(Project) private projectRepo: Repository<Project>,
        // private columnsService: ColumnsService,
        // private tasksService: TasksService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { id } = request.body;  // Извлечение ID из тела запроса
        const { url } = request;

        console.log('Request URL:', url);
        console.log('Request Body:', request.body);
        console.log('Extracted ID:', id);

        const auth = request.headers.authorization;
        if (!auth) {
            throw new UnauthorizedException({ message: 'Authorization header missing' });
        }
    
        const bearer = auth.split(' ')[0];
        const token = auth.split(' ')[1];
    
        if (bearer !== 'Bearer' || !token) {
            throw new UnauthorizedException({ message: 'Invalid token format' });
        }
    
        const user = this.jwtService.verify(token);
        if (!user || !user.sub) {
            throw new UnauthorizedException({ message: 'Invalid token payload' });
        }
    
        request.user = user;
    
        console.log('User: ', user)

        if (!id) {
            throw new HttpException('Invalid request', HttpStatus.BAD_REQUEST);
        }

        let resource;

        if (url.includes('/projects')) {
            resource = await this.projectRepo.findOne({where: {id}, relations: {user: true}});
        } else if (url.includes('/columns')) {
            // resource = await this.columnsService.findColumnByID(id);
        } else if (url.includes('/tasks')) {
            // resource = await this.tasksService.findTaskByID(id);
        } else {
            throw new HttpException('Resource not found', HttpStatus.NOT_FOUND);
        }

        if (!resource) {
            throw new HttpException('Resource not found', HttpStatus.NOT_FOUND);
        }

        console.log('Resource: ', resource)

        // Исправление здесь: сравниваем resource.user.id с user.sub
        if (resource.user.id !== user.sub) {
            throw new HttpException('You do not own this resource', HttpStatus.FORBIDDEN);
        }

        return true;
    }
}
