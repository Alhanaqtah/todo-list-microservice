import { List } from "src/lists/list.model";
import { Task } from "src/tasks/task.model";
import { OneToMany, PrimaryGeneratedColumn, Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Col {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'text', unique: true })
    title: string

    @Column({ type: 'integer', unique: true })
    orber: number

    @ManyToOne(type => List, list => list.columns)
    list: List

    @OneToMany(type => Task, task => task.column, {onDelete: 'CASCADE'})
    tasks: Task[]
}