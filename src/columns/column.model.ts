import { ApiProperty } from '@nestjs/swagger';
import { Project } from "src/projects/project.model";
import { Task } from "src/tasks/task.model";
import { OneToMany, PrimaryGeneratedColumn, Column, Entity, ManyToOne, JoinColumn } from "typeorm";

@Entity({name: 'columns'})
export class Col {
    @ApiProperty({ example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab', description: 'The unique identifier of the column' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'To Do', description: 'The title of the column' })
    @Column({ type: 'text', unique: true })
    title: string;

    @ApiProperty({ example: 1, description: 'The order of the column' })
    @Column({ type: 'integer', unique: true })
    order: number;

    @ApiProperty({ type: () => Project, description: 'The project this column belongs to' })
    @ManyToOne(type => Project, project => project.columns, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'project_id'})
    project: Project;

    @ApiProperty({ type: () => [Task], description: 'The tasks in this column' })
    @OneToMany(type => Task, task => task.column)
    tasks: Task[];
}
