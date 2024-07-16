import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/user.model';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'Регистрация пользователя' })
    @ApiResponse({ status: 201, description: 'Пользователь успешно зарегистрирован.', type: User })
    @Post('/signin')
    async signin(@Body() userDto: CreateUserDto) {
        return this.authService.createUser(userDto);
    }

    @ApiOperation({ summary: 'Вход в систему' })
    @ApiResponse({ status: 200, description: 'Аутентификация успешна. Возвращает токен доступа.', type: 'token' })
    @Post('/login')
    login(@Body() userDto: CreateUserDto) {
        return this.authService.login(userDto);
    }
}
