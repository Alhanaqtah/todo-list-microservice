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

    @ApiOperation({ summary: 'Create project' })
    @ApiResponse({ status: 201, description: 'The project has been successfully created.', type: Project })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiBody({ type: CreateProjectDto })
    @UseGuards(JWTAuthGuard)
    @Post()
    async create(@Req() req: any, @Body() projectDto: CreateProjectDto) {
        return await this.projectService.create(req.user, projectDto);
    }

    @ApiOperation({ summary: 'Get project' })
    @ApiOkResponse({ description: 'The project has been successfully retrieved.', type: Project })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Not Found.' })
    @ApiParam({ name: 'id', description: 'The ID of the project' })
    @UseGuards(OwnerGuard)
    @Get(':id')
    async read(@Req() req: any) {
        const projectId = req.resourceId;
        return await this.projectService.find(projectId);
    }

    @ApiOperation({ summary: 'Update project' })
    @ApiOkResponse({ description: 'The project has been successfully updated.', type: Project })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Not Found.' })
    @ApiParam({ name: 'id', description: 'The ID of the project' })
    @ApiBody({ type: CreateProjectDto })
    @UseGuards(OwnerGuard)
    @Put(':id')
    async update(@Req() req: any, @Body() projectDto: CreateProjectDto) {
        const projectId = req.resourceId;
        return await this.projectService.update(projectId, projectDto);
    }

    @ApiOperation({ summary: 'Delete project' })
    @ApiOkResponse({ description: 'The project has been successfully deleted.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Not Found.' })
    @ApiParam({ name: 'id', description: 'The ID of the project' })
    @UseGuards(OwnerGuard)
    @Delete(':id')
    async delete(@Req() req: any) {
        const projectId = req.resourceId;
        return await this.projectService.remove(projectId);
    }
}
