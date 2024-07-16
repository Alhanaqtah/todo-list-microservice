import { IsNotEmpty, IsString } from "class-validator"

export class UpdateTaskDto {
    @IsString()
    readonly title: string
    
    @IsString()
    readonly description: string
}