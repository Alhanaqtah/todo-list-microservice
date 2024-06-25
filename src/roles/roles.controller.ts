import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService) {}

    @Get()
    getAll() {
        return this.roleService.getAll()
    }

    @Post()
    create(@Body() roleDto: CreateRoleDto) {
        return this.roleService.create(roleDto);
    }
}
