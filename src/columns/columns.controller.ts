import { Body, Controller, Delete, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateColumnDto } from './dto/create-column.dto';
import { ColumnsService } from './columns.service';

@UseGuards(RolesGuard)
@Controller('columns')
export class ColumnsController {
    constructor(private columnService: ColumnsService) {}

    @Roles('user', 'admin')
    @Post()
    async create(@Body() columnDto: CreateColumnDto) {
        return await this.columnService.create(columnDto);
    }

    @UseGuards(UseGuards)
    @Get(':id')
    async read(@Req() req: any) {
        return await this.columnService.read(req.resourceId);
    }

    @UseGuards(UseGuards)
    @Put(':id')
    async update() {
        
    }

    @UseGuards(UseGuards)
    @Delete(':id')
    async delete() {
        
    }

    @UseGuards(UseGuards)
    @Put(':id')
    async move() {
        
    }
}
