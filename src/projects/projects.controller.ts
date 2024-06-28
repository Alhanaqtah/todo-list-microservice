import { Controller, Post, Get, Put, Delete, Body, Req, UseGuards, Param, Inject } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ProjectIdDto } from './dto/project-id.dto';
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
    async read(@Req() req: any, @Body() projectId: ProjectIdDto) {
        return await this.projectService.find(projectId.id);
    }

    // @UseGuards(OwnerGuard)
    // @Put()
    // async update(@Body() projectDto: CreateProjectDto) {
    //     return await this.projectService.update(projectDto);
    // }

    // @UseGuards(OwnerGuard)
    // @Delete()
    // async delete() {

    // }
}
