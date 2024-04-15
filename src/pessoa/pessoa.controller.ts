import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PessoaService } from './pessoa.service';
import { Pessoa } from './pessoa.entity';

@Controller('pessoa')
export class PessoaController {

    constructor(
        private readonly pessoaService: PessoaService
    ) {}

    @Get()
    findAll() {
        return this.pessoaService.findAll()
    }

    @Get(":id")
    findOne(@Param("id") id: number) {
        return this.pessoaService.findOne(id)
    }

    @Post()
    save(@Body() pessoa: Pessoa) {
        return this.pessoaService.save(pessoa)
    }

    @Delete(":id")
    delete(@Param("id") id: number) {
        return this.pessoaService.delete(id)
    }

}
