import { Extrato } from "src/extrato/extrato.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("rateio")
export class Rateio {
    @PrimaryGeneratedColumn()
    id: number
    @ManyToOne(() => Extrato, {
        nullable: false,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "extratoId" })
    extrato: Extrato
    @Column()
    extratoId: number
    @Column()
    ordem: number
    @Column()
    conta: string
    @Column({
        type: "decimal",
        precision: 14,
        scale: 2,
    })
    valor: number
    @Column()
    historico: string
}

