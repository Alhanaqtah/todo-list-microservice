import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class MoveTaskDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'UUID колонки, в которую перемещается задача'
    })
    @IsUUID()
    @IsNotEmpty()
    readonly columnId: string;
    
    @ApiProperty({
        example: 1,
        description: 'Новый порядок задачи в колонке'
    })
    @IsNumber()
    @IsNotEmpty()
    readonly newOrder: number;
}
