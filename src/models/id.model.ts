import { ApiProperty } from "@nestjs/swagger";

export class IdModel {
    @ApiProperty({
        example: 1
    })
    id: number
}