import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './user.model';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@UseGuards(RolesGuard)
@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Roles('admin')
    @ApiOperation({summary: 'Создать пользователя'})
    @ApiResponse({status: 200, type: User})
    @Post()
    async create(@Body() userDto: CreateUserDto) {
        return this.userService.createUser(userDto);
    }
}
