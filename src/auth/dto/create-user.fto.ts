import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {
    @ApiProperty({example: 'jhon@mail.com', description: 'Email пользователя'})
    readonly email: string
    @ApiProperty({example: 'boo-pass', description: 'Пароль пользователя'})
    readonly password: string
}