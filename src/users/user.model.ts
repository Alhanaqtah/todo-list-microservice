import { ApiProperty } from "@nestjs/swagger";
import { Project } from "src/projects/project.model";
import { Role } from "src/roles/roles.model";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class User {
    
    @ApiProperty({example: '4ee37af4-b53d-438e-92af-b5165383d5f9', description: 'Уникальный идентификатор пользователя'})
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ApiProperty({example: 'jhon@mail.com', description: 'Email пользователя'})
    @Column({type: 'varchar', unique: true})
    email: string

    @ApiProperty({example: 'boo-pass', description: 'Пароль пользователя'})
    @Column({type: 'bytea', name: 'pass_hash'})
    password: string

    @ApiProperty({example: true, description: 'Активен пользователь или забанен'})
    @Column({type: 'boolean', default: true})
    isActive: boolean

    @OneToMany(type => Project, project => project.user)
    projects: Project[]

    @ApiProperty({example: Role, description: 'Роли пользователя'})
    @ManyToMany(type => Role, role => role.users, {onDelete: 'CASCADE'})
    @JoinTable({name: 'users_roles'})
    roles: Role[]    
}