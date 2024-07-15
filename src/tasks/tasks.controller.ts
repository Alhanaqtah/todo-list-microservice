import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { OwnerGuard } from 'src/auth/owner.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) {}

    @UseGuards(OwnerGuard)
    @Post()
    async create(@Body() taskDto: CreateTaskDto) {
        return await this.taskService.create(taskDto);
    }

    @UseGuards(OwnerGuard)
    @Get(':id')
    async read(@Req() req: any) {
        return await this.taskService.read(req.resourceId);
    }

    @UseGuards(OwnerGuard)
    @Put(':id')
    async update(@Req() req: any, @Body() taskDto: UpdateTaskDto) {
        return await this.taskService.update(req.resourceId, taskDto);
    }

    @UseGuards(OwnerGuard)
    @Delete(':id')
    async delete(@Req() req: any) {
        return await this.taskService.remove(req.resourceId);
    }

    @UseGuards(OwnerGuard)
    @Put('/move/:id')
    async move(@Req() req: any, @Body() taskDto: MoveTaskDto) {
        return await this.taskService.move(req.resourceId, taskDto);
    }
}
