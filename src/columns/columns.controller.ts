import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateColumnDto } from './dto/create-column.dto';
import { ColumnsService } from './columns.service';
import { OwnerGuard } from 'src/auth/owner.guard';
import { Col } from './column.model';

@ApiTags('columns')
@UseGuards(RolesGuard)
@Controller('columns')
export class ColumnsController {
    constructor(private columnService: ColumnsService) {}

    @Roles('user', 'admin')
    @Post()
    @ApiOperation({ summary: 'Create a new column' })
    @ApiResponse({ status: 201, description: 'The column has been successfully created.', type: Col })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiBody({ type: CreateColumnDto })
    async create(@Body() columnDto: CreateColumnDto) {
        return await this.columnService.create(columnDto);
    }

    @UseGuards(OwnerGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Get column by ID' })
    @ApiResponse({ status: 200, description: 'The column has been successfully fetched.', type: Col })
    @ApiResponse({ status: 404, description: 'Column not found.' })
    @ApiParam({ name: 'id', description: 'Column ID' })
    async read(@Req() req: any) {
        return await this.columnService.read(req.resourceId);
    }

    @UseGuards(OwnerGuard)
    @Put(':id')
    @ApiOperation({ summary: 'Update column by ID' })
    @ApiResponse({ status: 200, description: 'The column has been successfully updated.', type: Col })
    @ApiResponse({ status: 404, description: 'Column not found.' })
    @ApiParam({ name: 'id', description: 'Column ID' })
    @ApiBody({ type: CreateColumnDto })
    async update(@Req() req: any, @Body() columnDto: CreateColumnDto) {
        return await this.columnService.update(req.resourceId, columnDto);
    }

    @UseGuards(OwnerGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete column by ID' })
    @ApiResponse({ status: 200, description: 'The column has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Column not found.' })
    @ApiParam({ name: 'id', description: 'Column ID' })
    async delete(@Req() req: any) {
        await this.columnService.remove(req.resourceId);
        return;
    }

    @UseGuards(OwnerGuard)
    @Put('/move/:id')
    @ApiOperation({ summary: 'Move column to a new order' })
    @ApiResponse({ status: 200, description: 'The column has been successfully moved.', type: Col })
    @ApiResponse({ status: 400, description: 'Invalid newOrder value.' })
    @ApiResponse({ status: 404, description: 'Column not found.' })
    @ApiParam({ name: 'id', description: 'Column ID' })
    @ApiBody({ schema: { type: 'object', properties: { newOrder: { type: 'number', example: 1 }}}})
    async move(@Param('id') columnId: string, @Body('newOrder') newOrder: number) {
        return this.columnService.moveColumn(columnId, newOrder);
    }
}
