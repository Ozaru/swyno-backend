import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pessoa } from './pessoa.entity';

@Injectable()
export class PessoaService {

    constructor(
        @InjectRepository(Pessoa)
        private readonly pessoaRepository: Repository<Pessoa>,
    ) { }

    async findAll(): Promise<Pessoa[]> {
        const lista = await this.pessoaRepository.find()
        return lista
    }

    async findOne(id: number): Promise<Pessoa> {
        const entidade = await this.pessoaRepository.findOneBy({ id })
        if(!entidade) {
            throw new BadRequestException("[id] nao encontrado")
        }
        return entidade
    }

    async save(pessoa: Pessoa): Promise<number> {
        if(!pessoa.nome || pessoa.nome.length > 50) {
            throw new BadRequestException("[nome] deve ter entre 1 e 50 caracteres")
        }
        const entidade = await this.pessoaRepository.save(pessoa)
        return entidade.id
    }

    async delete(id: number): Promise<void> {
        await this.findOne(id)
        await this.pessoaRepository.delete({ id })
    }

}
