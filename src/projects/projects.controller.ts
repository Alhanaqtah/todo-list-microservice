import { Controller, Post, Get, Put, Delete, Body, Req, UseGuards, Param, Inject } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { OwnerGuard } from 'src/auth/owner.guard';

@UseGuards(RolesGuard)
@Controller('projects')
export class ProjectsController {
    constructor(private projectService: ProjectsService) {}

    @Roles('user', 'admin')
    @Post()
    async create(@Req() req: any, @Body() projectDto: CreateProjectDto) {
        return await this.projectService.create(req.user, projectDto);
    }

    @UseGuards(OwnerGuard)
    @Get()
    async read(@Req() req: any) {
        const projectId = req.resourceId;
        return await this.projectService.find(projectId);
    }

    @UseGuards(OwnerGuard)
    @Put()
    async update(@Req() req: any, @Body() projectDto: CreateProjectDto) {
        const projectId = req.resourceId;
        return await this.projectService.update(projectId, projectDto);
    }

    // @UseGuards(OwnerGuard)
    // @Delete()
    // async delete() {

    // }
}
