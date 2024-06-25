import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.model';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/roles.model';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepo: Repository<User>,
                private roleService: RolesService) {}

    async createUser(dto: CreateUserDto) {
        const potentialUser = await this.findUserByEmail(dto.email);
        if (potentialUser) {
            throw new HttpException('User already exists', HttpStatus.CONFLICT);
        }
        
        let roles: Role[] = [];
        
        for (const roleValue of dto.roles) {
            const role = await this.roleService.getRoleByValue(roleValue);
            if (role) {
                roles.push(role);
            }
        }

        if (roles.length === 0) {
            const defaultRole = await this.roleService.getRoleByValue('user');
            roles.push(defaultRole);
        }

        let passHash = await bcryptjs.hash(dto.password, 5);

        const user = this.userRepo.create({
            ...dto,
            roles: roles,
            password: passHash
        });

        await this.userRepo.save(user);
        return user;
    }

    async findUserByEmail(email: string): Promise<User> {
        const user = await this.userRepo.findOne({where: {email}});
        return user;
    }
}
