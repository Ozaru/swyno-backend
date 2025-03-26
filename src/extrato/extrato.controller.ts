import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AppError } from 'src/exceptions/app-exception-filter';
import { IdModel } from 'src/models/id.model';
import { ExtratoFiltro, ExtratoForm, ExtratoPagina } from './extrato.dto';
import { ExtratoService } from './extrato.service';

@Controller('extrato')
@ApiTags("Extrato")
export class ExtratoController {

    constructor(
        private readonly extratoService: ExtratoService
    ) { }

    @Get()
    @ApiOperation({ summary: "Extrato - Filtrar" })
    @ApiOkResponse({ description: "OK", type: ExtratoPagina })
    @ApiBadRequestResponse({ description: "Erro", type: AppError })
    filtrar(
        @Query() filtro: ExtratoFiltro,
    ) {
        const extratoFiltro = Object.assign(new ExtratoFiltro(), filtro)
        return this.extratoService.filtrar(extratoFiltro)
    }

    @Get(":id")
    @ApiOperation({ summary: "Extrato - Obter" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ description: "OK", type: ExtratoForm })
    @ApiBadRequestResponse({ description: "Erro", type: AppError })
    obter(@Param("id") id: number) {
        return this.extratoService.obter(id)
    }

    @Post()
    @ApiOperation({ summary: "Extrato - Salvar" })
    @ApiOkResponse({ description: "OK", type: IdModel })
    @ApiBadRequestResponse({ description: "Erro", type: AppError })
    salvar(@Body() extrato: ExtratoForm) {
        return this.extratoService.salvar(extrato)
    }

    @Delete(":id")
    @ApiOperation({ summary: "Extrato - Excluir" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ description: "OK" })
    @ApiBadRequestResponse({ description: "Erro", type: AppError })
    excluir(@Param("id") id: number) {
        return this.extratoService.excluir(id)
    }

    @Get(":id/subir")
    @ApiOperation({ summary: "Extrato - Subir" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ description: "OK" })
    @ApiBadRequestResponse({ description: "Erro", type: AppError })
    subir(@Param("id") id: number) {
        return this.extratoService.subir(id)
    }

    @Get(":id/descer")
    @ApiOperation({ summary: "Extrato - Descer" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ description: "OK" })
    @ApiBadRequestResponse({ description: "Erro", type: AppError })
    descer(@Param("id") id: number) {
        return this.extratoService.descer(id)
    }

}
