import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateProjectDto {
    @ApiProperty({ 
        example: 'My Project', 
        type: 'string', 
        description: 'The title of the project',
        required: true 
    })
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @ApiProperty({ 
        example: 'This is a sample project', 
        type: 'string', 
        description: 'The description of the project',
        required: false 
    })
    @IsString()
    readonly description: string;
}