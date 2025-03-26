import { ApiProperty } from "@nestjs/swagger"

export enum MovimentoFiltroColuna {
    ID = "id",
    NOME = "nome",
}

export enum MovimentoFiltroDirecao {
    ASC = "ASC",
    DESC = "DESC",
}

export class MovimentoFiltro {
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
        enum: MovimentoFiltroColuna,
        required: false,
        example: MovimentoFiltroColuna.NOME,
    })
    order = MovimentoFiltroColuna.NOME
    @ApiProperty({
        enum: MovimentoFiltroDirecao,
        required: false,
        example: MovimentoFiltroDirecao.ASC,
    })
    direction = MovimentoFiltroDirecao.ASC
    @ApiProperty({
        type: 'integer',
        required: false,
    })
    id: number
    @ApiProperty({
        type: 'string',
        required: false,
    })
    nome: string
}

export class MovimentoItem {
    @ApiProperty({
        example: 1,
    })
    id: number
    @ApiProperty({
        example: "nome"
    })
    nome: string
}

export class MovimentoPagina {
    @ApiProperty({
        type: [MovimentoItem],
    })
    items: MovimentoItem[]
    @ApiProperty({
        type: "integer",
        example: 1,
    })
    count: number
    @ApiProperty({
        type: MovimentoFiltro,
    })
    filter: MovimentoFiltro
}

export class MovimentoForm {
    @ApiProperty({
        required: false,
        example: 1,
    })
    id: number
    @ApiProperty({
        example: "nome"
    })
    nome: string
}