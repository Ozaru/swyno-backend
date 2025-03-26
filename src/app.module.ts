import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MovimentoModule } from './movimento/movimento.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movimento } from './movimento/movimento.entity';
import { Extrato } from './extrato/extrato.entity';
import { ExtratoModule } from './extrato/extrato.module';
import { Rateio } from './rateio/rateio.entity';
import { RateioModule } from './rateio/rateio.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database/swyno.sqlite',
      synchronize: true,
      entities: [
        Movimento,
        Extrato,
        Rateio,
      ],
    }),
    MovimentoModule,
    ExtratoModule,
    RateioModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
