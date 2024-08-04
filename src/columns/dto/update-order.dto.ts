import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateOrderDto {
    @ApiProperty({ example: 2, description: 'The new order of the column' })
    @IsNumber()
    @IsNotEmpty()
    order: number;
}