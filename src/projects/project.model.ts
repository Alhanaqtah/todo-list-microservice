import { Task } from "src/tasks/task.model";
import { User } from "src/users/user.model";
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'projects'})
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @OneToMany(type => Task, task => task.project)
    tasks: Task[]

    @ManyToOne(type => User, user => user.projects)
    user: string
}