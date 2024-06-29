import { Body, Controller, Delete, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateColumnDto } from './dto/create-column.dto';
import { ColumnsService } from './columns.service';
import { OwnerGuard } from 'src/auth/owner.guard';

@UseGuards(RolesGuard)
@Controller('columns')
export class ColumnsController {
    constructor(private columnService: ColumnsService) {}

    @Roles('user', 'admin')
    @Post()
    async create(@Body() columnDto: CreateColumnDto) {
        return await this.columnService.create(columnDto);
    }

    @UseGuards(OwnerGuard)
    @Get(':id')
    async read(@Req() req: any) {
        return await this.columnService.read(req.resourceId);
    }

    @UseGuards(OwnerGuard)
    @Put(':id')
    async update(@Req() req: any, @Body() columnDto: CreateColumnDto) {
        return await this.columnService.update(req.resourceId, columnDto);
    }

    @UseGuards(OwnerGuard)
    @Delete(':id')
    async delete(@Req() req: any) {
        await this.columnService.remove(req.resourceId);
        return;
    }

    // @UseGuards(UseGuards)
    // @Put('/move/:id')
    // async move() {
        
    // }
}
