import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.model';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

    async createUser(dto: CreateUserDto) {
        const potentilUser = await this.findUserByEmail(dto.email);
        // if (potentilUser) {
        //     throw new HttpException('User already exists', HttpStatus.CONFLICT);
        // }

        const user = this.userRepo.create(dto);
        console.log(user);
        this.userRepo.save(user)
        
        return user;
    }

    async findUserByEmail(email: string) {
        const user = await this.userRepo.findOneBy({email});
        return user;
    }
}
