import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("pessoas")
export class Pessoa {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    nome: string
}