import { Controller, Post, Get, Put, Delete, Body, Req, UseGuards, Param, Inject } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { OwnerGuard } from 'src/auth/owner.guard';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Project } from './project.model';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('projects')
export class ProjectsController {
    constructor(private projectService: ProjectsService) {}

    @ApiOperation({ summary: 'Create project' })
    @ApiResponse({ status: 201, description: 'The project has been successfully created.', type: Project })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiBody({ type: CreateProjectDto })
    @Roles('user', 'admin')
    @Post()
    async create(@Req() req: any, @Body() projectDto: CreateProjectDto) {
        return await this.projectService.create(req.user, projectDto);
    }

    @UseGuards(OwnerGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Get project' })
    @ApiOkResponse({ description: 'The project has been successfully retrieved.', type: Project })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Not Found.' })
    @ApiParam({ name: 'id', description: 'The ID of the project' })
    async read(@Req() req: any) {
        const projectId = req.resourceId;
        return await this.projectService.find(projectId);
    }

    @UseGuards(OwnerGuard)
    @Put(':id')
    @ApiOperation({ summary: 'Update project' })
    @ApiOkResponse({ description: 'The project has been successfully updated.', type: Project })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Not Found.' })
    @ApiParam({ name: 'id', description: 'The ID of the project' })
    @ApiBody({ type: CreateProjectDto })
    async update(@Req() req: any, @Body() projectDto: CreateProjectDto) {
        const projectId = req.resourceId;
        return await this.projectService.update(projectId, projectDto);
    }

    @UseGuards(OwnerGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete project' })
    @ApiOkResponse({ description: 'The project has been successfully deleted.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Not Found.' })
    @ApiParam({ name: 'id', description: 'The ID of the project' })
    async delete(@Req() req: any) {
        const projectId = req.resourceId;
        return await this.projectService.remove(req.resourceId);
    }
}
