import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AppError } from 'src/exceptions/app-exception-filter';
import { IdModel } from 'src/models/id.model';
import { MovimentoFiltro, MovimentoForm, MovimentoPagina } from './movimento.dto';
import { MovimentoService } from './movimento.service';

@Controller('movimento')
@ApiTags("Movimento")
export class MovimentoController {

    constructor(
        private readonly movimentoService: MovimentoService
    ) { }

    @Get()
    @ApiOperation({ summary: "Movimento - Filtrar" })
    @ApiOkResponse({ description: "OK", type: MovimentoPagina })
    @ApiBadRequestResponse({ description: "Erro", type: AppError })
    filtrar(
        @Query() filtro: MovimentoFiltro,
    ) {
        const movimentoFiltro = Object.assign(new MovimentoFiltro(), filtro)
        return this.movimentoService.filtrar(movimentoFiltro)
    }

    @Get(":id")
    @ApiOperation({ summary: "Movimento - Obter" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ description: "OK", type: MovimentoForm })
    @ApiBadRequestResponse({ description: "Erro", type: AppError })
    obter(@Param("id") id: number) {
        return this.movimentoService.obter(id)
    }

    @Post()
    @ApiOperation({ summary: "Movimento - Salvar" })
    @ApiOkResponse({ description: "OK", type: IdModel })
    @ApiBadRequestResponse({ description: "Erro", type: AppError })
    salvar(@Body() movimento: MovimentoForm) {
        return this.movimentoService.salvar(movimento)
    }

    @Delete(":id")
    @ApiOperation({ summary: "Movimento - Excluir" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ description: "OK" })
    @ApiBadRequestResponse({ description: "Erro", type: AppError })
    excluir(@Param("id") id: number) {
        return this.movimentoService.excluir(id)
    }

}
