import { Col } from "src/columns/column.model";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { types } from "util";

@Entity({name: 'tasks'})
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({type: 'text', unique: true})
    title: string

    @Column({type: 'text', unique: false})
    description: string

    @Column({type: 'integer'})
    order: number

    @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
    creation_time: Date

    @ManyToOne(type => Col, column => column.tasks, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'column_id'})
    column: Col
}