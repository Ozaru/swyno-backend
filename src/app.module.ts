import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PessoaModule } from './pessoa/pessoa.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pessoa } from './pessoa/pessoa.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database/swyno.sqlite',
      synchronize: true,
      entities: [
        Pessoa
      ],
    }),
    PessoaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
