import { Body, Controller, Delete, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { OwnerGuard } from 'src/auth/owner.guard';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(OwnerGuard)
@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) {}

    @ApiOperation({ summary: 'Создать задачу' })
    @ApiResponse({ status: 201, description: 'Задача успешно создана.' })
    @ApiResponse({ status: 403, description: 'Доступ запрещен.' })
    @ApiBody({ type: CreateTaskDto })
    @Post()
    async create(@Body() taskDto: CreateTaskDto) {
        return await this.taskService.create(taskDto);
    }

    @ApiOperation({ summary: 'Получить задачу по ID' })
    @ApiResponse({ status: 200, description: 'Задача найдена и успешно получена.' })
    @ApiResponse({ status: 403, description: 'Доступ запрещен.' })
    @ApiResponse({ status: 404, description: 'Задача не найдена.' })
    @ApiParam({ name: 'id', description: 'ID задачи' })
    @Get(':id')
    async read(@Req() req: any) {
        return await this.taskService.read(req.resourceId);
    }

    @ApiOperation({ summary: 'Обновить задачу по ID' })
    @ApiResponse({ status: 200, description: 'Задача успешно обновлена.' })
    @ApiResponse({ status: 403, description: 'Доступ запрещен.' })
    @ApiResponse({ status: 404, description: 'Задача не найдена.' })
    @ApiParam({ name: 'id', description: 'ID задачи' })
    @ApiBody({ type: UpdateTaskDto })
    @Put(':id')
    async update(@Req() req: any, @Body() taskDto: UpdateTaskDto) {
        return await this.taskService.update(req.resourceId, taskDto);
    }

    @ApiOperation({ summary: 'Удалить задачу по ID' })
    @ApiResponse({ status: 200, description: 'Задача успешно удалена.' })
    @ApiResponse({ status: 403, description: 'Доступ запрещен.' })
    @ApiResponse({ status: 404, description: 'Задача не найдена.' })
    @ApiParam({ name: 'id', description: 'ID задачи' })
    @Delete(':id')
    async delete(@Req() req: any) {
        return await this.taskService.remove(req.resourceId);
    }

    @ApiOperation({ summary: 'Переместить задачу в новый порядок' })
    @ApiResponse({ status: 200, description: 'Задача успешно перемещена.' })
    @ApiResponse({ status: 400, description: 'Некорректное значение newOrder.' })
    @ApiResponse({ status: 404, description: 'Задача не найдена.' })
    @ApiParam({ name: 'id', description: 'ID задачи' })
    @ApiBody({ type: MoveTaskDto })
    @Put('/move/:id')
    async move(@Req() req: any, @Body() taskDto: MoveTaskDto) {
        return await this.taskService.move(req.resourceId, taskDto);
    }
}
