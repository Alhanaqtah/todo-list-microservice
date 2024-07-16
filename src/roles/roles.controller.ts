import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/user.model';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('roles')
@UseGuards(RolesGuard)
@Roles('admin')
@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService) {}

    @ApiOperation({summary: 'Получить всех пользователей'})
    @ApiResponse({status: 200, type: [User]})
    @Get()
    getAll() {
        return this.roleService.getAll()
    }

    @ApiOperation({summary: 'Создать пользователя'})
    @ApiResponse({status: 201, type: User})
    @Post()
    create(@Body() roleDto: CreateRoleDto) {
        return this.roleService.create(roleDto);
    }

    @Put(':id')
    update(@Param() roleId: string, @Body() roleDto: CreateRoleDto) {
        return this.roleService.update(roleId, roleDto);
    }

    @Delete(':id')
    delete(@Param() roleId: string) {
        return this.roleService.remove(roleId);
    }
}
