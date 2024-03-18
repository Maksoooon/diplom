import { Controller, Get } from '@nestjs/common';
import { AddressService } from './address.service';

@Controller('address')
export class AddressController {
  constructor(private readonly appService: AddressService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
