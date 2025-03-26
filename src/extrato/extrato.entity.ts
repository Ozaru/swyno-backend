import { Movimento } from "src/movimento/movimento.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("extrato")
export class Extrato {
    @PrimaryGeneratedColumn()
    id: number
    @ManyToOne(() => Movimento, {
        nullable: false,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "movimentoId" })
    movimento: Movimento
    @Column()
    movimentoId: number
    @Column()
    ordem: number
    @Column()
    conta: string
    @Column({
        type: "date"
    })
    data: string
    @Column({
        type: "decimal",
        precision: 14,
        scale: 2,
    })
    valor: number
    @Column()
    historico: string
}

