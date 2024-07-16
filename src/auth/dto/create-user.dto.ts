import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        example: 'jhon@mail.com',
        description: 'Email пользователя'
    })
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty({
        example: 'boo-pass',
        description: 'Пароль пользователя'
    })
    @IsString()
    @IsNotEmpty()
    readonly password: string;
}
