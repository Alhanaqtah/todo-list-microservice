import { ApiProperty } from "@nestjs/swagger"

export class CreateProjectDto {
    @ApiProperty({ example: 'My Project', type: 'string', description: 'The title of the project' })
    readonly title: string
    @ApiProperty({ example: 'This is a sample project', type: 'string', description: 'The description of the project' })
    readonly description: string
}