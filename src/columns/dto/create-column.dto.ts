import { ApiProperty } from "@nestjs/swagger";

export class CreateColumnDto {
    @ApiProperty({ example: 'project-id', description: 'The ID of the project this column belongs to' })
    readonly projectId: string;

    @ApiProperty({ example: 'New Column', description: 'The title of the column' })
    readonly title: string;
}