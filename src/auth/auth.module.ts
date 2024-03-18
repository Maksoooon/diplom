import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Register } from './auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './auth.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user'}),
    JwtModule.registerAsync({
      useFactory: () => ({
        global: true,
        secret: process.env.JWT_KEY,
        signOptions: { expiresIn: process.env.JWT_EXPIRE}  
      })
    }),
    TypeOrmModule.forFeature([Register])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})

export class AuthModule {}
