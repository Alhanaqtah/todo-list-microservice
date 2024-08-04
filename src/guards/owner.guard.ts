import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from 'src/tasks/task.model';
import { Project } from 'src/projects/project.model';
import { Col } from 'src/columns/column.model';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Col)
    private columnRepository: Repository<Col>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    let resourceType = this.getResourceType(request.url);
    let resourceId: string;
    [resourceId, resourceType] = this.getResourceId(request, resourceType);
    const token = this.getToken(request);
    const user = this.verifyToken(token);

    request.user = user;
    request.resourceId = resourceId;

    const ownerId = await this.getOwner(resourceType, resourceId);

    if (ownerId !== user.sub) {
      throw new UnauthorizedException({ message: 'You are not the owner of this resource' });
    }

    return true;
  }

  private getResourceId(request: any, resourceType: string): [string, string] {
    let { id } = request.params;

    if (!id) {
      if (resourceType === 'columns' && request.body.projectId) {
        resourceType = 'projects';
        return [request.body.projectId, resourceType];
      } else if (resourceType === 'tasks' && request.body.columnId) {
        resourceType = 'columns';
        return [request.body.columnId, resourceType];
      }
      throw new HttpException('Resource id missing', HttpStatus.BAD_REQUEST);
    }
  
    return [id, resourceType];
  }
  

  private getResourceType(url: string): string {
    const parts = url.split('/');
    if (!['tasks', 'projects', 'columns'].includes(parts[1])) {
      throw new HttpException('Invalid resource type', HttpStatus.BAD_REQUEST);
    }
    return parts[1];
  }

  private getToken(request: Request): string {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException({ message: 'Invalid token format' });
    }
    return authHeader.split(' ')[1];
  }

  private verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException({ message: 'Invalid token' });
    }
  }

  private async getOwner(resourceType: string, resourceId: string): Promise<string> {
    let id;
    switch (resourceType) {
      case 'projects': {
        const project = await this.projectRepository.findOne({ where: { id: resourceId }});
        if (!project) {
          throw new HttpException('Resource not found', HttpStatus.NOT_FOUND);
        }
        id = project.user_id;
        break;
      }
      case 'columns': {
        const column = await this.columnRepository.findOne({ where: { id: resourceId }, relations: ['project'] });
        if (!column || !column.project) {
          throw new HttpException('Resource not found', HttpStatus.NOT_FOUND);
        }
        id = column.project.user_id;
        break;
      }
      case 'tasks': {
        const task = await this.taskRepository.findOne({ where: { id: resourceId }, relations: ['column', 'column.project'] });
        if (!task || !task.column || !task.column.project) {
          throw new HttpException('Resource not found', HttpStatus.NOT_FOUND);
        }
        id = task.column.project.user_id;
        break;
      }
      default:
        throw new HttpException('Invalid resource type', HttpStatus.BAD_REQUEST);
    }
    return id;
  }
}