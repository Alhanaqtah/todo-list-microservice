import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateTaskDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'UUID колонки, к которой принадлежит задача'
    })
    @IsUUID()
    @IsNotEmpty()
    readonly columnId: string;

    @ApiProperty({
        example: 'Заголовок задачи',
        description: 'Заголовок задачи'
    })
    @IsString()
    @IsNotEmpty()
    readonly title: string;
    
    @ApiProperty({
        example: 'Описание задачи',
        description: 'Описание задачи',
        required: false
    })
    @IsString()
    readonly description: string;
}
