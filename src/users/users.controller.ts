import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './user.model';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('users')
@UseGuards(RolesGuard)
@Roles('admin')
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @ApiOperation({summary: 'Создать пользователя'})
    @ApiResponse({status: 200, type: User})
    @Post()
    async create(@Body() userDto: CreateUserDto) {
        return this.userService.createUser(userDto);
    }

    @Get(':id')
    async read(@Param() userId: string) {
        return this.userService.read(userId);
    }

    @Patch(':id')
    async update(@Param('id') userId: string, @Body() userDto: CreateUserDto) {
        return this.userService.update(userId, userDto);
    }

    @Delete(':id')
    async delete(@Body() userDto: CreateUserDto) {
        return this.userService.createUser(userDto);
    }
}
