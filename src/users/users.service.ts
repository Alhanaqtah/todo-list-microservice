import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.model';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/roles.model';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepo: Repository<User>,
                private roleService: RolesService) {}

    async createUser(dto: CreateUserDto) {
        const potentilUser = await this.findUserByEmail(dto.email);
        if (potentilUser) {
            throw new HttpException('User already exists', HttpStatus.CONFLICT);
        }
        
        let roles: Role[] = [];
        
        if (!dto.roles || dto.roles.length === 0) {
            const role = await this.roleService.getRoleByValue('user');
            roles.push(role);
        } else {
            for (const value of dto.roles) {
                const role = await this.roleService.getRoleByValue(value);
                if (role) {
                    roles.push(role);
                }
            }
        }

        const user = this.userRepo.create({
            ...dto,
            roles
        });

        return await this.userRepo.save(user);
    }

    async findUserByEmail(email: string) {
        const user = await this.userRepo.findOneBy({email});
        return user;
    }
}
