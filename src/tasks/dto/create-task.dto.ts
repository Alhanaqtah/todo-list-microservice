import { IsNotEmpty, IsString, IsUUID } from "class-validator"

export class CreateTaskDto {
    @IsUUID()
    @IsNotEmpty()
    readonly columnId: string

    @IsString()
    @IsNotEmpty()
    readonly title: string
    
    @IsString()
    readonly description: string
}