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
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const resourceId = this.getResourceId(request);
    const resourceType = this.getResourceType(request.url);
    const token = this.getToken(request);
    const user = this.verifyToken(token);

    request.user = user;

    const resource = await this.getResource(resourceType, resourceId);

    if (!resource) {
      throw new HttpException('Resource not found', HttpStatus.NOT_FOUND);
    }

    request.resourceId = resourceId;

    const userId = await this.getOwner(resourceType, resourceId);

    if (!userId) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    if (userId !== user.sub) {
      throw new UnauthorizedException({ message: 'You are not the user of this resource' });
    }

    return true;

    // throw new UnauthorizedException({ message: 'Unauthorized' });
  }

  private getResourceId(request: any): string {
    const { id } = request.params;
    if (!id) {
      throw new HttpException('Resource id missing in request body', HttpStatus.BAD_REQUEST);
    }
    return id;
  }

  private getResourceType(url: string): string {
    const parts = url.split('/');
    if (!['lists', 'tasks', 'projects', 'columns'].includes(parts[1])) {
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

  private async getResource(resourceType: string, resourceId: string): Promise<any> {
    switch (resourceType) {
      case 'tasks':
        return this.taskRepository.findOneBy({ id: resourceId });
      case 'projects':
        return this.projectRepository.findOneBy({ id: resourceId });
      case 'columns':
        return this.columnRepository.findOneBy({ id: resourceId });
      default:
        throw new HttpException('Invalid resource type', HttpStatus.BAD_REQUEST);
    }
  }

  private async getOwner(resourceType: string, resourceId: string): Promise<string> {
    switch (resourceType) {
      case 'projects': {
        const project = await this.projectRepository.findOne({ where: { id: resourceId }, relations: ['user'] });
        return project.user.id;
      }
      case 'columns': {
        const column = await this.columnRepository.findOne({ where: { id: resourceId }, relations: ['project', 'project.user'] });
        return column.project.user.id;
      }
      case 'tasks': {
        const task = await this.taskRepository.findOne({ where: { id: resourceId }, relations: ['column', 'column.project', 'column.project.user'] });
        return task.column.project.user.id;
      }
      default:
        throw new HttpException('Invalid resource type', HttpStatus.BAD_REQUEST);
    }
  }
}
