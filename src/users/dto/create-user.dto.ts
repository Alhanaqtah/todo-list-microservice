import { ApiProperty } from "@nestjs/swagger"
import { Role } from "src/roles/roles.model"

export class CreateUserDto {
    @ApiProperty({example: 'jhon@mail.com', description: 'Email пользователя'})
    readonly email: string
    @ApiProperty({example: 'boo-pass', description: 'Пароль пользователя'})
    readonly password: string
    @ApiProperty({example: 'user', description: 'Роли пользователя'})
    readonly roles: string[]
}