import { IsNotEmpty, IsNumber, IsUUID } from "class-validator"

export class MoveTaskDto {
    @IsUUID()
    @IsNotEmpty()
    readonly columnId: string
    
    @IsNumber()
    @IsNotEmpty()
    readonly newOrder: number
}