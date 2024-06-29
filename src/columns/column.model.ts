import { Project } from "src/projects/project.model";
import { Task } from "src/tasks/task.model";
import { OneToMany, PrimaryGeneratedColumn, Column, Entity, ManyToOne } from "typeorm";

@Entity({name: 'columns'})
export class Col {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'text', unique: true })
    title: string

    @Column({ type: 'integer', unique: true })
    order: number

    @ManyToOne(type => Project, list => list.columns)
    project: Project

    @OneToMany(type => Task, task => task.column, {onDelete: 'CASCADE'})
    tasks: Task[]
}