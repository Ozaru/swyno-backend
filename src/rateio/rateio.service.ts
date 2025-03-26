import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IdModel } from 'src/models/id.model';
import { Extrato } from 'src/extrato/extrato.entity';
import { Repository } from 'typeorm';
import { RateioFiltro, RateioForm, RateioItem, RateioPagina } from './rateio.dto';
import { Rateio } from './rateio.entity';

@Injectable()
export class RateioService {

    constructor(
        @InjectRepository(Rateio)
        private readonly rateioRepository: Repository<Rateio>,
        @InjectRepository(Extrato)
        private readonly extratoRepository: Repository<Extrato>,
    ) { }

    async filtrar(rateioFiltro: RateioFiltro): Promise<RateioPagina> {
        let query = this.rateioRepository.createQueryBuilder("rateio").where("1 = 1")
        if (rateioFiltro.id) {
            query = query.andWhere("rateio.id = :id", { id: rateioFiltro.id })
        }
        if (!rateioFiltro.extratoId) {
            throw new Error("[extratoId] obrigatorio")
        }
        query = query.andWhere("rateio.extrato.id = :extratoId", { extratoId: rateioFiltro.extratoId })
        if (rateioFiltro.ordem) {
            query = query.andWhere("rateio.ordem = :ordem", { ordem: rateioFiltro.ordem })
        }
        if (rateioFiltro.conta) {
            query = query.andWhere("lower(rateio.conta) like lower(:conta)", { conta: `%${rateioFiltro.conta}%` })
        }
        if (rateioFiltro.valorInicial) {
            query = query.andWhere("rateio.valor >= :valorInicial", { valorInicial: rateioFiltro.valorInicial })
        }
        if (rateioFiltro.valorFinal) {
            query = query.andWhere("rateio.valor <= :valorFinal", { valorFinal: rateioFiltro.valorFinal })
        }
        if (rateioFiltro.historico) {
            query = query.andWhere("lower(rateio.historico) like lower(:historico)", { historico: `%${rateioFiltro.historico}%` })
        }
        query.orderBy(rateioFiltro.order, rateioFiltro.direction)
        query.skip((rateioFiltro.page - 1) * rateioFiltro.size)
        query.take(rateioFiltro.size)
        const [rateios, count] = await query.getManyAndCount()
        const items = rateios.map(rateio => {
            const item: RateioItem = {
                id: rateio.id,
                extratoId: rateio.extratoId,
                ordem: rateio.ordem,
                conta: rateio.conta,
                valor: rateio.valor,
                historico: rateio.historico,
            }
            return item
        })
        const pagina: RateioPagina = {
            items,
            count,
            filter: rateioFiltro,
        }
        return pagina
    }

    async obter(id: number): Promise<RateioForm> {
        const rateio = await this.rateioRepository.findOneBy({ id })
        if (!rateio) {
            throw new Error("[id] nao encontrado")
        }
        const item: RateioForm = {
            id: rateio.id,
            extratoId: rateio.extratoId,
            ordem: rateio.ordem,
            conta: rateio.conta,
            valor: rateio.valor,
            historico: rateio.historico,
        }
        return item
    }

    async salvar(rateioForm: RateioForm): Promise<IdModel> {
        if (rateioForm.id) {
            const rateio = await this.obter(rateioForm.id)
            if (rateioForm.extratoId != rateio.extratoId) {
                throw new Error("[extratoId] nao pode ser alterado")
            }
            if (rateioForm.ordem != rateio.ordem) {
                throw new Error("[ordem] nao pode ser alterado")
            }
        } else {
            const ordemMax = await this.rateioRepository.maximum('ordem', { extrato: { id: rateioForm.extratoId } })
            rateioForm.ordem = ordemMax + 1
        }
        if (!rateioForm.extratoId) {
            throw new Error("[extratoId] obrigatorio")
        }
        const existeExtrato = await this.extratoRepository.existsBy({ id: rateioForm.extratoId })
        if (!existeExtrato) {
            throw new Error("[extratoId] nao encontrado")
        }
        const regexConta = /^[a-z0-9_-]{1,20}$/
        if (!regexConta.test(rateioForm.conta)) {
            throw new Error("[conta] invalido")
        }
        const validaValor = rateioForm.valor && new Number(rateioForm.valor.toFixed(2)).valueOf() == rateioForm.valor
        if (!validaValor) {
            throw new Error("[valor] invalido")
        }
        if (!rateioForm.historico || rateioForm.historico.length > 500) {
            throw new Error("[historico] invalido")
        }
        const rateio: Partial<Rateio> = {
            id: rateioForm.id,
            extratoId: rateioForm.extratoId,
            ordem: rateioForm.ordem,
            conta: rateioForm.conta,
            valor: rateioForm.valor,
            historico: rateioForm.historico,
        }
        const { id } = await this.rateioRepository.save(rateio)
        const item: IdModel = { id }
        await this.ajustaOrdem(rateioForm.extratoId)
        return item
    }

    async excluir(id: number): Promise<void> {
        const { extratoId } = await this.obter(id)
        await this.rateioRepository.delete({ id })
        await this.ajustaOrdem(extratoId)
    }

    async subir(id: number): Promise<void> {
        const rateio = await this.rateioRepository.findOneByOrFail({ id })
        const ordem = rateio.ordem
        if(ordem == 1){
            throw new Error("[ordem] ja esta em primeiro")
        }
        const rateioAnterior = await this.rateioRepository.findOneByOrFail({
            extratoId: rateio.extratoId,
            ordem: ordem - 1,
        })
        rateio.ordem = ordem - 1
        rateioAnterior.ordem = ordem
        await this.rateioRepository.save([rateio, rateioAnterior])
    }

    async descer(id: number): Promise<void> {
        const rateio = await this.rateioRepository.findOneByOrFail({ id })
        const ordem = rateio.ordem
        const ordemMax = await this.rateioRepository.maximum('ordem', { extrato: { id: rateio.extratoId } })
        if(ordem == ordemMax){
            throw new Error("[ordem] ja esta em ultimo")
        }
        const rateioPosterior = await this.rateioRepository.findOneByOrFail({
            extratoId: rateio.extratoId,
            ordem: ordem + 1,
        })
        rateio.ordem = ordem + 1
        rateioPosterior.ordem = ordem
        await this.rateioRepository.save([rateio, rateioPosterior])
    }

    private async ajustaOrdem(extratoId: number) {
        const rateios = await this.rateioRepository.find({
            where: {
                extratoId: extratoId,
            },
            order: {
                ordem: 'ASC',
            },
        })
        rateios.forEach((rateio, index) => {
            rateio.ordem = index + 1
        })
        await this.rateioRepository.save(rateios)
    }

}
