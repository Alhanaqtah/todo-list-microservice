import { List } from "src/lists/list.model";
import { User } from "src/users/user.model";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'projects'})
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({type: 'text', unique: true})
    title: string

    @Column({type: 'text'})
    description: string

    @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMPZ'})
    creation_time: Date

    @OneToMany(type => List, list => list.project, {onDelete: 'CASCADE'})
    lists: List[]

    @ManyToOne(type => User, user => user.projects)
    user: User
}