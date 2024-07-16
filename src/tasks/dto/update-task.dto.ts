import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateTaskDto {
    @ApiProperty({
        example: 'Новая задача',
        description: 'Заголовок задачи',
        required: false
    })
    @IsString()
    readonly title: string;
    
    @ApiProperty({
        example: 'Описание задачи',
        description: 'Описание задачи',
        required: false
    })
    @IsString()
    readonly description: string;
}
