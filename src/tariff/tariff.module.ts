import { Module } from '@nestjs/common';
import { TariffController } from './tariff.controller';
import { TariffService } from './tariff.service';
import { Tariff } from './tariff.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Tariff])],
  controllers: [TariffController],
  providers: [TariffService],
})

export class TariffModule {}
