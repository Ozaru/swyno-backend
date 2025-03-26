import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movimento } from 'src/movimento/movimento.entity';
import { ExtratoController } from './extrato.controller';
import { Extrato } from './extrato.entity';
import { ExtratoService } from './extrato.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Extrato, Movimento]),
  ],
  controllers: [
    ExtratoController,
  ],
  providers: [
    ExtratoService,
  ]
})
export class ExtratoModule {}
