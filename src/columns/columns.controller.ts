import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CreateColumnDto } from './dto/create-column.dto';
import { ColumnsService } from './columns.service';
import { OwnerGuard } from 'src/auth/owner.guard';
import { Col } from './column.model';

@ApiTags('columns')
@ApiBearerAuth()
@UseGuards(OwnerGuard)
@Controller('columns')
export class ColumnsController {
    constructor(private columnService: ColumnsService) {}

    @ApiOperation({ summary: 'Создать новую колонку' })
    @ApiResponse({ status: 201, description: 'Колонка успешно создана.', type: Col })
    @ApiResponse({ status: 403, description: 'Доступ запрещен.' })
    @ApiBody({ type: CreateColumnDto })
    @Post()
    async create(@Body() columnDto: CreateColumnDto) {
        return await this.columnService.create(columnDto);
    }

    @ApiOperation({ summary: 'Получить колонку по ID' })
    @ApiResponse({ status: 200, description: 'Колонка успешно найдена.', type: Col })
    @ApiResponse({ status: 404, description: 'Колонка не найдена.' })
    @ApiParam({ name: 'id', description: 'ID колонки' })
    @Get(':id')
    async read(@Param('id') columnId: string) {
        return await this.columnService.read(columnId);
    }

    @ApiOperation({ summary: 'Обновить колонку по ID' })
    @ApiResponse({ status: 200, description: 'Колонка успешно обновлена.', type: Col })
    @ApiResponse({ status: 404, description: 'Колонка не найдена.' })
    @ApiParam({ name: 'id', description: 'ID колонки' })
    @ApiBody({ type: CreateColumnDto })
    @Put(':id')
    async update(@Param('id') columnId: string, @Body() columnDto: CreateColumnDto) {
        return await this.columnService.update(columnId, columnDto);
    }

    @ApiOperation({ summary: 'Удалить колонку по ID' })
    @ApiResponse({ status: 200, description: 'Колонка успешно удалена.' })
    @ApiResponse({ status: 404, description: 'Колонка не найдена.' })
    @ApiParam({ name: 'id', description: 'ID колонки' })
    @Delete(':id')
    async delete(@Param('id') columnId: string) {
        await this.columnService.remove(columnId);
        return;
    }

    @ApiOperation({ summary: 'Переместить колонку на новую позицию' })
    @ApiResponse({ status: 200, description: 'Колонка успешно перемещена.', type: Col })
    @ApiResponse({ status: 400, description: 'Недопустимое значение newOrder.' })
    @ApiResponse({ status: 404, description: 'Колонка не найдена.' })
    @ApiParam({ name: 'id', description: 'ID колонки' })
    @ApiBody({ schema: { type: 'object', properties: { newOrder: { type: 'number', example: 1 } } } })
    @Put('/move/:id')
    async move(@Param('id') columnId: string, @Body('newOrder') newOrder: number) {
        return this.columnService.moveColumn(columnId, newOrder);
    }
}
