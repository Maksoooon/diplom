import { Module, OnModuleInit } from '@nestjs/common';
import { TariffController } from './tariff.controller';
import { TariffService } from './tariff.service';
import { Tariff } from './tariff.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as tariffs from '../../seeds/tariffSeed.json';

@Module({
  imports: [TypeOrmModule.forFeature([Tariff])],
  controllers: [TariffController],
  providers: [TariffService],
})

export class TariffModule  implements OnModuleInit {
  constructor(private tariffService: TariffService){}

  async onModuleInit(){
    const checkTariffSeed = await Tariff.find();
    if(checkTariffSeed.length == 0) {
      await Tariff.insert(tariffs.tariffs);
    }
  }

}
