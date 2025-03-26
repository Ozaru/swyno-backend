import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimentoController } from './movimento.controller';
import { Movimento } from './movimento.entity';
import { MovimentoService } from './movimento.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movimento]),
  ],
  controllers: [
    MovimentoController,
  ],
  providers: [
    MovimentoService,
  ]
})
export class MovimentoModule { }
