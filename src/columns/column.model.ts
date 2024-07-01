import { ApiProperty } from '@nestjs/swagger';
import { Project } from "src/projects/project.model";
import { Task } from "src/tasks/task.model";
import { OneToMany, PrimaryGeneratedColumn, Column, Entity, ManyToOne } from "typeorm";

@Entity({name: 'columns'})
export class Col {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({ example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab', description: 'The unique identifier of the column' })
    id: string;

    @Column({ type: 'text', unique: true })
    @ApiProperty({ example: 'To Do', description: 'The title of the column' })
    title: string;

    @Column({ type: 'integer', unique: true })
    @ApiProperty({ example: 1, description: 'The order of the column' })
    order: number;

    @ManyToOne(type => Project, project => project.columns)
    @ApiProperty({ type: () => Project, description: 'The project this column belongs to' })
    project: Project;

    @OneToMany(type => Task, task => task.column, { onDelete: 'CASCADE' })
    @ApiProperty({ type: () => [Task], description: 'The tasks in this column' })
    tasks: Task[];
}
