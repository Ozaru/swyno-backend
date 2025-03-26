import { ApiProperty } from "@nestjs/swagger"

export enum RateioFiltroColuna {
    ID = "id",
    EXTRATO_ID = "extratoId",
    ORDEM = "ordem",
    CONTA = "conta",
    VALOR = "valor",
    HISTORICO = "historico",
}

export enum RateioFiltroDirecao {
    ASC = "ASC",
    DESC = "DESC",
}

export class RateioFiltro {
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
        enum: RateioFiltroColuna,
        required: false,
        example: RateioFiltroColuna.ORDEM,
    })
    order = RateioFiltroColuna.ORDEM
    @ApiProperty({
        enum: RateioFiltroDirecao,
        required: false,
        example: RateioFiltroDirecao.ASC,
    })
    direction = RateioFiltroDirecao.ASC
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
    extratoId: number
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

export class RateioItem {
    @ApiProperty({
        example: 1,
    })
    id: number
    @ApiProperty({
        example: 1,
    })
    extratoId: number
    @ApiProperty({
        example: 1,
    })
    ordem: number
    @ApiProperty({
        example: "conta",
    })
    conta: string
    @ApiProperty({
        example: -123.45,
    })
    valor: number
    @ApiProperty({
        example: "historico",
    })
    historico: string
}

export class RateioPagina {
    @ApiProperty({
        type: [RateioItem],
    })
    items: RateioItem[]
    @ApiProperty({
        type: "integer",
        example: 1,
    })
    count: number
    @ApiProperty({
        type: RateioFiltro,
    })
    filter: RateioFiltro
}

export class RateioForm {
    @ApiProperty({
        required: false,
        example: 1,
    })
    id: number
    @ApiProperty({
        required: true,
        example: 1,
    })
    extratoId: number
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
        example: -123.45,
    })
    valor: number
    @ApiProperty({
        required: true,
        example: "historico",
    })
    historico: string
}