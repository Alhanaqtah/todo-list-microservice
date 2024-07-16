import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsArray } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: 'jhon@mail.com', description: 'Email пользователя' })
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty({ example: 'boo-pass', description: 'Пароль пользователя' })
    @IsString()
    @IsNotEmpty()
    readonly password: string;

    @ApiProperty({ example: ['user'], description: 'Роли пользователя', isArray: true })
    @IsArray()
    @IsString({ each: true })
    readonly roles: string[];
}
