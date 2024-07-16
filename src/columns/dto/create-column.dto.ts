import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateColumnDto {
    @ApiProperty({ example: 'project-id', description: 'The ID of the project this column belongs to' })
    @IsUUID()
    readonly projectId: string;

    @ApiProperty({ example: 'New Column', description: 'The title of the column' })
    @IsString()
    @IsNotEmpty()
    readonly title: string;
}