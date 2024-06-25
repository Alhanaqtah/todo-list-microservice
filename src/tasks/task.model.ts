import { Project } from "src/projects/project.model";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tasks'})
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(type => Project, project => project.tasks)
    project: Project
}