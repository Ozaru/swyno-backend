import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Extrato } from 'src/extrato/extrato.entity';
import { RateioController } from './rateio.controller';
import { Rateio } from './rateio.entity';
import { RateioService } from './rateio.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rateio, Extrato]),
  ],
  controllers: [
    RateioController,
  ],
  providers: [
    RateioService,
  ]
})
export class RateioModule {}
