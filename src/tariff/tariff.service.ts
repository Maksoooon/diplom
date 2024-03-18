import { Injectable } from '@nestjs/common';
import { Tariff } from './tariff.entity';

@Injectable()
export class TariffService {
  async getAll() {
    const tariffs = await Tariff.find();
    tariffs.push()
    return Tariff.find();
  }
}
