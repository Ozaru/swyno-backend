import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AppError } from 'src/exceptions/app-exception-filter';
import { IdModel } from 'src/models/id.model';
import { RateioFiltro, RateioForm, RateioPagina } from './rateio.dto';
import { RateioService } from './rateio.service';

@Controller('rateio')
@ApiTags("Rateio")
export class RateioController {

    constructor(
        private readonly rateioService: RateioService
    ) { }

    @Get()
    @ApiOperation({ summary: "Rateio - Filtrar" })
    @ApiOkResponse({ description: "OK", type: RateioPagina })
    @ApiBadRequestResponse({ description: "Erro", type: AppError })
    filtrar(
        @Query() filtro: RateioFiltro,
    ) {
        const rateioFiltro = Object.assign(new RateioFiltro(), filtro)
        return this.rateioService.filtrar(rateioFiltro)
    }

    @Get(":id")
    @ApiOperation({ summary: "Rateio - Obter" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ description: "OK", type: RateioForm })
    @ApiBadRequestResponse({ description: "Erro", type: AppError })
    obter(@Param("id") id: number) {
        return this.rateioService.obter(id)
    }

    @Post()
    @ApiOperation({ summary: "Rateio - Salvar" })
    @ApiOkResponse({ description: "OK", type: IdModel })
    @ApiBadRequestResponse({ description: "Erro", type: AppError })
    salvar(@Body() rateio: RateioForm) {
        return this.rateioService.salvar(rateio)
    }

    @Delete(":id")
    @ApiOperation({ summary: "Rateio - Excluir" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ description: "OK" })
    @ApiBadRequestResponse({ description: "Erro", type: AppError })
    excluir(@Param("id") id: number) {
        return this.rateioService.excluir(id)
    }

    @Get(":id/subir")
    @ApiOperation({ summary: "Rateio - Subir" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ description: "OK" })
    @ApiBadRequestResponse({ description: "Erro", type: AppError })
    subir(@Param("id") id: number) {
        return this.rateioService.subir(id)
    }

    @Get(":id/descer")
    @ApiOperation({ summary: "Rateio - Descer" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ description: "OK" })
    @ApiBadRequestResponse({ description: "Erro", type: AppError })
    descer(@Param("id") id: number) {
        return this.rateioService.descer(id)
    }

}
