import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { AddressModule } from './address/address.module';
import { ContractModule } from './contract/contract.module';
import { FeedModule } from './feed/feed.module';
import { TariffModule } from './tariff/tariff.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }), 
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),

    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      schema: process.env.DB_SCHEMA,
      entities: ['../**/*.entity.{ts}'],
      synchronize: true,
      autoLoadEntities: true
    }),
    AuthModule, AddressModule, ContractModule, FeedModule, TariffModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
