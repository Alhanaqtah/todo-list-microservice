import { ApiProperty } from "@nestjs/swagger";

export class UpdateOrderDto {
    @ApiProperty({ example: 2, description: 'The new order of the column' })
    order: number;
}