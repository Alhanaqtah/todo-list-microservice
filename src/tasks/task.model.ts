import { Col } from "src/columns/column.model";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tasks'})
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({type: 'text', unique: true})
    title: string

    @Column({type: 'text'})
    description: string

    @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
    creation_time: Date

    @ManyToOne(type => Col, column => column.tasks)
    column: Col
}