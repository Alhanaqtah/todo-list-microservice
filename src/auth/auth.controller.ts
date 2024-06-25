import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
    constructor(private userService: UsersService) {}

    @Post('/signin')
    async signin(@Body() userDto: CreateUserDto) {
        this.userService.createUser(userDto);
    }

    @Post('/login')
    login() {

    }
}
