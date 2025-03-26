import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IdModel } from 'src/models/id.model';
import { Movimento } from 'src/movimento/movimento.entity';
import { Repository } from 'typeorm';
import { ExtratoFiltro, ExtratoForm, ExtratoItem, ExtratoPagina } from './extrato.dto';
import { Extrato } from './extrato.entity';

@Injectable()
export class ExtratoService {

    constructor(
        @InjectRepository(Extrato)
        private readonly extratoRepository: Repository<Extrato>,
        @InjectRepository(Movimento)
        private readonly movimentoRepository: Repository<Movimento>,
    ) { }

    async filtrar(extratoFiltro: ExtratoFiltro): Promise<ExtratoPagina> {
        let query = this.extratoRepository.createQueryBuilder("extrato").where("1 = 1")
        if (extratoFiltro.id) {
            query = query.andWhere("extrato.id = :id", { id: extratoFiltro.id })
        }
        if (!extratoFiltro.movimentoId) {
            throw new Error("[movimentoId] obrigatorio")
        }
        query = query.andWhere("extrato.movimento.id = :movimentoId", { movimentoId: extratoFiltro.movimentoId })
        if (extratoFiltro.ordem) {
            query = query.andWhere("extrato.ordem = :ordem", { ordem: extratoFiltro.ordem })
        }
        if (extratoFiltro.conta) {
            query = query.andWhere("lower(extrato.conta) like lower(:conta)", { conta: `%${extratoFiltro.conta}%` })
        }
        if (extratoFiltro.dataInicial) {
            query = query.andWhere("extrato.data >= :dataInicial", { dataInicial: extratoFiltro.dataInicial })
        }
        if (extratoFiltro.dataFinal) {
            query = query.andWhere("extrato.data <= :dataFinal", { dataFinal: extratoFiltro.dataFinal })
        }
        if (extratoFiltro.valorInicial) {
            query = query.andWhere("extrato.valor >= :valorInicial", { valorInicial: extratoFiltro.valorInicial })
        }
        if (extratoFiltro.valorFinal) {
            query = query.andWhere("extrato.valor <= :valorFinal", { valorFinal: extratoFiltro.valorFinal })
        }
        if (extratoFiltro.historico) {
            query = query.andWhere("lower(extrato.historico) like lower(:historico)", { historico: `%${extratoFiltro.historico}%` })
        }
        query.orderBy(extratoFiltro.order, extratoFiltro.direction)
        query.skip((extratoFiltro.page - 1) * extratoFiltro.size)
        query.take(extratoFiltro.size)
        const [extratos, count] = await query.getManyAndCount()
        const items = extratos.map(extrato => {
            const item: ExtratoItem = {
                id: extrato.id,
                movimentoId: extrato.movimentoId,
                ordem: extrato.ordem,
                conta: extrato.conta,
                data: extrato.data,
                valor: extrato.valor,
                historico: extrato.historico,
            }
            return item
        })
        const pagina: ExtratoPagina = {
            items,
            count,
            filter: extratoFiltro,
        }
        return pagina
    }

    async obter(id: number): Promise<ExtratoForm> {
        const extrato = await this.extratoRepository.findOneBy({ id })
        if (!extrato) {
            throw new Error("[id] nao encontrado")
        }
        const item: ExtratoForm = {
            id: extrato.id,
            movimentoId: extrato.movimentoId,
            ordem: extrato.ordem,
            conta: extrato.conta,
            data: extrato.data,
            valor: extrato.valor,
            historico: extrato.historico,
        }
        return item
    }

    async salvar(extratoForm: ExtratoForm): Promise<IdModel> {
        if (extratoForm.id) {
            const extrato = await this.obter(extratoForm.id)
            if (extratoForm.movimentoId != extrato.movimentoId) {
                throw new Error("[movimentoId] nao pode ser alterado")
            }
            if (extratoForm.ordem != extrato.ordem) {
                throw new Error("[ordem] nao pode ser alterado")
            }
        } else {
            const ordemMax = await this.extratoRepository.maximum('ordem', { movimento: { id: extratoForm.movimentoId } })
            extratoForm.ordem = ordemMax + 1
        }
        if (!extratoForm.movimentoId) {
            throw new Error("[movimentoId] obrigatorio")
        }
        const existeMovimento = await this.movimentoRepository.existsBy({ id: extratoForm.movimentoId })
        if (!existeMovimento) {
            throw new Error("[movimentoId] nao encontrado")
        }
        const regexConta = /^[a-z0-9_-]{1,20}$/
        if (!regexConta.test(extratoForm.conta)) {
            throw new Error("[conta] invalido")
        }
        const regexData = /^\d{4}-\d{2}-\d{2}$/
        if (!regexData.test(extratoForm.data)) {
            throw new Error("[data] invalido")
        }
        const validaValor = extratoForm.valor && new Number(extratoForm.valor.toFixed(2)).valueOf() == extratoForm.valor
        if (!validaValor) {
            throw new Error("[valor] invalido")
        }
        if (!extratoForm.historico || extratoForm.historico.length > 500) {
            throw new Error("[historico] invalido")
        }
        const extrato: Partial<Extrato> = {
            id: extratoForm.id,
            movimentoId: extratoForm.movimentoId,
            ordem: extratoForm.ordem,
            conta: extratoForm.conta,
            data: extratoForm.data,
            valor: extratoForm.valor,
            historico: extratoForm.historico,
        }
        const { id } = await this.extratoRepository.save(extrato)
        const item: IdModel = { id }
        await this.ajustaOrdem(extratoForm.movimentoId)
        return item
    }

    async excluir(id: number): Promise<void> {
        const { movimentoId } = await this.obter(id)
        await this.extratoRepository.delete({ id })
        await this.ajustaOrdem(movimentoId)
    }

    async subir(id: number): Promise<void> {
        const extrato = await this.extratoRepository.findOneByOrFail({ id })
        const ordem = extrato.ordem
        if(ordem == 1){
            throw new Error("[ordem] ja esta em primeiro")
        }
        const extratoAnterior = await this.extratoRepository.findOneByOrFail({
            movimentoId: extrato.movimentoId,
            ordem: ordem - 1,
        })
        if(extrato.data.localeCompare(extratoAnterior.data) > 0){
            throw new Error("[data] nao pode ser maior que a data do extrato anterior")
        }
        extrato.ordem = ordem - 1
        extratoAnterior.ordem = ordem
        await this.extratoRepository.save([extrato, extratoAnterior])
    }

    async descer(id: number): Promise<void> {
        const extrato = await this.extratoRepository.findOneByOrFail({ id })
        const ordem = extrato.ordem
        const ordemMax = await this.extratoRepository.maximum('ordem', { movimento: { id: extrato.movimentoId } })
        if(ordem == ordemMax){
            throw new Error("[ordem] ja esta em ultimo")
        }
        const extratoPosterior = await this.extratoRepository.findOneByOrFail({
            movimentoId: extrato.movimentoId,
            ordem: ordem + 1,
        })
        if(extrato.data.localeCompare(extratoPosterior.data) < 0){
            throw new Error("[data] nao pode ser menor que a data do extrato posterior")
        }
        extrato.ordem = ordem + 1
        extratoPosterior.ordem = ordem
        await this.extratoRepository.save([extrato, extratoPosterior])
    }

    private async ajustaOrdem(movimentoId: number) {
        const extratos = await this.extratoRepository.find({
            where: {
                movimentoId: movimentoId,
            },
            order: {
                data: 'ASC',
                ordem: 'ASC',
            },
        })
        extratos.forEach((extrato, index) => {
            extrato.ordem = index + 1
        })
        await this.extratoRepository.save(extratos)
    }

}
