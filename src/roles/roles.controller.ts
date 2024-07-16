import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/user.model';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles('admin')
@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService) {}

    @ApiOperation({ summary: 'Получить список всех ролей' })
    @ApiResponse({ status: 200, description: 'Список ролей', type: [User] })
    @Get()
    getAll() {
        return this.roleService.getAll();
    }

    @ApiOperation({ summary: 'Создать новую роль' })
    @ApiResponse({ status: 201, description: 'Роль успешно создана', type: User })
    @ApiResponse({ status: 400, description: 'Некорректные данные' })
    @Post()
    create(@Body() roleDto: CreateRoleDto) {
        return this.roleService.create(roleDto);
    }

    @ApiOperation({ summary: 'Обновить информацию о роли' })
    @ApiResponse({ status: 200, description: 'Роль успешно обновлена', type: User })
    @ApiResponse({ status: 400, description: 'Некорректные данные' })
    @ApiResponse({ status: 404, description: 'Роль не найдена' })
    @Put(':id')
    update(@Param('id') roleId: string, @Body() roleDto: CreateRoleDto) {
        return this.roleService.update(roleId, roleDto);
    }

    @ApiOperation({ summary: 'Удалить роль' })
    @ApiResponse({ status: 200, description: 'Роль успешно удалена' })
    @ApiResponse({ status: 404, description: 'Роль не найдена' })
    @Delete(':id')
    delete(@Param('id') roleId: string) {
        return this.roleService.remove(roleId);
    }
}
