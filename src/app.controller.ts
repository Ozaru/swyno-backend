import { Controller, Get } from '@nestjs/common';
import { HealthCheckModel } from './models/healt-check.model';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppError } from './exceptions/app-exception-filter';

@Controller()
@ApiTags("Root")
export class AppController {

  @Get()
  @ApiOperation({ summary: "Root - Health check" })
  @ApiOkResponse({ description: "OK", type: HealthCheckModel })
  @ApiBadRequestResponse({ description: "Erro", type: AppError })
  healthCheck() {
    return new HealthCheckModel()
  }

}
