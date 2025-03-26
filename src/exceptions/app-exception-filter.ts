
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Request, Response } from 'express';

@Catch(HttpException)
export class AppExceptionFilter implements ExceptionFilter {

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    response
      .status(HttpStatus.BAD_REQUEST)
      .json({
        message: exception.message,
        type: status,
        timestamp: new Date().toISOString(),
      })
  }

}

export class AppError {
  @ApiProperty({
    example: "erro desconhecido"
  })
  message: string
  @ApiProperty({
    example: 500
  })
  type: number
  @ApiProperty({
    example: "2000-01-01T00:00:00.000Z"
  })
  timestamp: string
}