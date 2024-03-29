import { Body, Controller, Get, Post } from '@nestjs/common';

import { AddressService } from './address.service';
import { CreateAddress } from 'src/dto/adress.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  getHello(): string {
    return this.addressService.getHello();
  }

  @Post()
  createAdress(@Body() body: CreateAddress): { status: string } {
    return this.addressService.create();
  }
}
