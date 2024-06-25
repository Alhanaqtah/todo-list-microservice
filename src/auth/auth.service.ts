import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private userSevice: UsersService,
                private jwtService: JwtService
    ) {}

    async createUser(userDto: CreateUserDto) {
        const user = await this.userSevice.createUser(userDto);
        let token = this.generateToken(user);
        return token;
    }

    generateToken(user: User) {
        return {
            token: this.jwtService.sign({
                sub: user.id,
                roles: user.roles
            })
        }
    }
}
