import { Col } from "src/columns/column.model";
import { Project } from "src/projects/project.model";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class List {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({type: 'text', unique: true})
    tutle: string

    @ManyToOne(type => Project, project => project.lists)
    project: Project

    @OneToMany(type => Col, column => column.list, {onDelete: 'CASCADE'})
    columns: Col[]
}