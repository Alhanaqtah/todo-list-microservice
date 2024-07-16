import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateRoleDto {
    @ApiProperty({example: 'user', description: 'Название роли'})
    @IsString()
    @IsNotEmpty()
    readonly value: string

    @ApiProperty({example: 'Роль рядового пользователя сервиса', description: 'Описание роли'})
    @IsString()
    @IsNotEmpty()
    readonly description: string
}