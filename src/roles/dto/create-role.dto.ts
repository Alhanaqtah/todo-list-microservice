import { ApiProperty } from "@nestjs/swagger"

export class CreateRoleDto {
    @ApiProperty({example: 'user', description: 'Название роли'})
    readonly value: string
    @ApiProperty({example: 'Роль рядового пользователя сервиса', description: 'Описание роли'})
    readonly description: string
}