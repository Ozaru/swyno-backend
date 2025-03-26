import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("movimento")
export class Movimento {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    nome: string
}