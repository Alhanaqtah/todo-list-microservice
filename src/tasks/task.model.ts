import { Col } from "src/columns/column.model";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tasks'})
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(type => Col, column => column.tasks)
    column: Col
}