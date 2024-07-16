import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './user.model';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles('admin')
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @ApiOperation({ summary: 'Создать пользователя' })
    @ApiResponse({ status: 201, description: 'Пользователь успешно создан', type: User })
    @ApiResponse({ status: 400, description: 'Некорректные данные' })
    @Post()
    async create(@Body() userDto: CreateUserDto) {
        return this.userService.createUser(userDto);
    }

    @ApiOperation({ summary: 'Получить информацию о пользователе' })
    @ApiResponse({ status: 200, description: 'Информация о пользователе', type: User })
    @ApiResponse({ status: 404, description: 'Пользователь не найден' })
    @Get(':id')
    async read(@Param('id') userId: string) {
        return this.userService.read(userId);
    }

    @ApiOperation({ summary: 'Обновить информацию о пользователе' })
    @ApiResponse({ status: 200, description: 'Пользователь успешно обновлен', type: User })
    @ApiResponse({ status: 400, description: 'Некорректные данные' })
    @ApiResponse({ status: 404, description: 'Пользователь не найден' })
    @Patch(':id')
    async update(@Param('id') userId: string, @Body() userDto: CreateUserDto) {
        return this.userService.update(userId, userDto);
    }

    @ApiOperation({ summary: 'Удалить пользователя' })
    @ApiResponse({ status: 200, description: 'Пользователь успешно удален' })
    @ApiResponse({ status: 404, description: 'Пользователь не найден' })
    @Delete(':id')
    async delete(@Param('id') userId: string) {
        return this.userService.remove(userId);
    }
}
