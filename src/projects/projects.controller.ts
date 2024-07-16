import { Controller, Post, Get, Put, Delete, Body, Req, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { OwnerGuard } from 'src/auth/owner.guard';
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Project } from './project.model';

@ApiTags('projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
    constructor(private projectService: ProjectsService) {}

    @ApiOperation({ summary: 'Создать проект' })
    @ApiResponse({ status: 201, description: 'Проект успешно создан.', type: Project })
    @ApiResponse({ status: 403, description: 'Доступ запрещен.' })
    @ApiBody({ type: CreateProjectDto })
    @UseGuards(JWTAuthGuard)
    @Post()
    async create(@Req() req: any, @Body() projectDto: CreateProjectDto) {
        return await this.projectService.create(req.user, projectDto);
    }

    @ApiOperation({ summary: 'Получить проект' })
    @ApiOkResponse({ description: 'Проект успешно найден.', type: Project })
    @ApiResponse({ status: 403, description: 'Доступ запрещен.' })
    @ApiResponse({ status: 404, description: 'Проект не найден.' })
    @ApiParam({ name: 'id', description: 'ID проекта' })
    @UseGuards(OwnerGuard)
    @Get(':id')
    async read(@Req() req: any) {
        const projectId = req.resourceId;
        return await this.projectService.find(projectId);
    }

    @ApiOperation({ summary: 'Обновить проект' })
    @ApiOkResponse({ description: 'Проект успешно обновлен.', type: Project })
    @ApiResponse({ status: 403, description: 'Доступ запрещен.' })
    @ApiResponse({ status: 404, description: 'Проект не найден.' })
    @ApiParam({ name: 'id', description: 'ID проекта' })
    @ApiBody({ type: CreateProjectDto })
    @UseGuards(OwnerGuard)
    @Put(':id')
    async update(@Req() req: any, @Body() projectDto: CreateProjectDto) {
        const projectId = req.resourceId;
        return await this.projectService.update(projectId, projectDto);
    }

    @ApiOperation({ summary: 'Удалить проект' })
    @ApiOkResponse({ description: 'Проект успешно удален.' })
    @ApiResponse({ status: 403, description: 'Доступ запрещен.' })
    @ApiResponse({ status: 404, description: 'Проект не найден.' })
    @ApiParam({ name: 'id', description: 'ID проекта' })
    @UseGuards(OwnerGuard)
    @Delete(':id')
    async delete(@Req() req: any) {
        const projectId = req.resourceId;
        return await this.projectService.remove(projectId);
    }
}
