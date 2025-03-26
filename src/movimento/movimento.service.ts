import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IdModel } from 'src/models/id.model';
import { Repository } from 'typeorm';
import { MovimentoFiltro, MovimentoForm, MovimentoItem, MovimentoPagina } from './movimento.dto';
import { Movimento } from './movimento.entity';

@Injectable()
export class MovimentoService {

    constructor(
        @InjectRepository(Movimento)
        private readonly movimentoRepository: Repository<Movimento>,
    ) { }

    async filtrar(movimentoFiltro: MovimentoFiltro): Promise<MovimentoPagina> {
        let query = this.movimentoRepository.createQueryBuilder("movimento").where("1 = 1")
        if (movimentoFiltro.id) {
            query = query.andWhere("movimento.id = :id", { id: movimentoFiltro.id })
        }
        if (movimentoFiltro.nome) {
            query = query.andWhere("lower(movimento.nome) like lower(:nome)", { nome: `%${movimentoFiltro.nome}%` })
        }
        query.orderBy(movimentoFiltro.order, movimentoFiltro.direction)
        query.skip((movimentoFiltro.page - 1) * movimentoFiltro.size)
        query.take(movimentoFiltro.size)
        const [movimentos, count] = await query.getManyAndCount()
        const items = movimentos.map(movimento => {
            const item: MovimentoItem = {
                id: movimento.id,
                nome: movimento.nome,
            }
            return item
        })
        const pagina: MovimentoPagina = {
            items,
            count,
            filter: movimentoFiltro,
        }
        return pagina
    }

    async obter(id: number): Promise<MovimentoForm> {
        const movimento = await this.movimentoRepository.findOneBy({ id })
        if (!movimento) {
            throw new Error("[id] nao encontrado")
        }
        const item: MovimentoForm = {
            id: movimento.id,
            nome: movimento.nome,
        }
        return item
    }

    async salvar(movimentoForm: MovimentoForm): Promise<IdModel> {
        if(movimentoForm.id){
            await this.obter(movimentoForm.id)
        }
        if (!movimentoForm.nome || movimentoForm.nome.length > 50) {
            throw new Error("[nome] deve ter entre 1 e 50 caracteres")
        }
        const movimento: Movimento = {
            id: movimentoForm.id,
            nome: movimentoForm.nome,
        }
        const { id } = await this.movimentoRepository.save(movimento)
        const item: IdModel = { id }
        return item
    }

    async excluir(id: number): Promise<void> {
        await this.obter(id)
        await this.movimentoRepository.delete({ id })
    }

}
