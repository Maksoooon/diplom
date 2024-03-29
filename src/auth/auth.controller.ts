import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from 'src/dto/auth.dto';
import { JwtAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  public login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  public getMyInfo(@Request() req) {
    return this.authService.jwtDecode(req.headers.authorization);
  }

}
