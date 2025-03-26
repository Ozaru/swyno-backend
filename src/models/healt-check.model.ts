import { ApiProperty } from "@nestjs/swagger"

export class HealthCheckModel {
    @ApiProperty({
        example: "OK"
    })
    message = "OK"
    @ApiProperty({
        example: 200
    })
    type = 200
    @ApiProperty({
        example: "2000-01-01T00:00:00.000Z"
    })
    timestamp = new Date().toISOString()
}