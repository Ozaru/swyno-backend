import { ApiProperty } from "@nestjs/swagger"

export enum ExtratoFiltroColuna {
    ID = "id",
    MOVIMENTO_ID = "movimentoId",
    ORDEM = "ordem",
    CONTA = "conta",
    DATA = "data",
    VALOR = "valor",
    HISTORICO = "historico",
}

export enum ExtratoFiltroDirecao {
    ASC = "ASC",
    DESC = "DESC",
}

export class ExtratoFiltro {
    @ApiProperty({
        type: 'integer',
        required: false,
        example: 1,
    })
    page = 1
    @ApiProperty({
        type: 'integer',
        required: false,
        example: 12,
    })
    size = 12
    @ApiProperty({
        enum: ExtratoFiltroColuna,
        required: false,
        example: ExtratoFiltroColuna.ORDEM,
    })
    order = ExtratoFiltroColuna.ORDEM
    @ApiProperty({
        enum: ExtratoFiltroDirecao,
        required: false,
        example: ExtratoFiltroDirecao.ASC,
    })
    direction = ExtratoFiltroDirecao.ASC
    @ApiProperty({
        type: 'integer',
        required: false,
    })
    id: number
    @ApiProperty({
        type: 'integer',
        required: true,
        example: 1,
    })
    movimentoId: number
    @ApiProperty({
        type: 'integer',
        required: false,
    })
    ordem: number
    @ApiProperty({
        type: 'string',
        required: false,
    })
    conta: string
    @ApiProperty({
        type: "string",
        format: "date",
        required: false,
    })
    dataInicial: string
    @ApiProperty({
        type: "string",
        format: "date",
        required: false,
    })
    dataFinal: string
    @ApiProperty({
        type: "number",
        multipleOf: 0.01,
        required: false,
    })
    valorInicial: number
    @ApiProperty({
        type: "number",
        multipleOf: 0.01,
        required: false,
    })
    valorFinal: number
    @ApiProperty({
        type: 'string',
        required: false,
    })
    historico: string
}

export class ExtratoItem {
    @ApiProperty({
        example: 1,
    })
    id: number
    @ApiProperty({
        example: 1,
    })
    movimentoId: number
    @ApiProperty({
        example: 1,
    })
    ordem: number
    @ApiProperty({
        example: "conta",
    })
    conta: string
    @ApiProperty({
        example: "2000-01-01",
    })
    data: string
    @ApiProperty({
        example: -123.45,
    })
    valor: number
    @ApiProperty({
        example: "historico",
    })
    historico: string
}

export class ExtratoPagina {
    @ApiProperty({
        type: [ExtratoItem],
    })
    items: ExtratoItem[]
    @ApiProperty({
        type: "integer",
        example: 1,
    })
    count: number
    @ApiProperty({
        type: ExtratoFiltro,
    })
    filter: ExtratoFiltro
}

export class ExtratoForm {
    @ApiProperty({
        required: false,
        example: 1,
    })
    id: number
    @ApiProperty({
        required: true,
        example: 1,
    })
    movimentoId: number
    @ApiProperty({
        required: true,
        example: 1,
    })
    ordem: number
    @ApiProperty({
        required: true,
        example: "conta",
    })
    conta: string
    @ApiProperty({
        required: true,
        example: "2000-01-01",
    })
    data: string
    @ApiProperty({
        required: true,
        example: -123.45,
    })
    valor: number
    @ApiProperty({
        required: true,
        example: "historico",
    })
    historico: string
}