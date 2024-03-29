import { Injectable } from '@nestjs/common';

@Injectable()
export class AddressService {
  getHello(): string {
    return 'Its address service!';
  }

  create(): { status: string } {
    return { status: 'ok' };
  }
}
