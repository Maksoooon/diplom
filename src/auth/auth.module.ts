import { Module, OnModuleInit } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Register } from './auth.entity';
import { JwtStrategy } from './auth.strategy';

import * as admins from '../../seeds/adminSeed.json';

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

export class AuthModule implements OnModuleInit{
  async onModuleInit(){
    const checkAdminSeed = await Register.findOne({
      where: {
        login: 'admin'
      }
    });
    if(!checkAdminSeed) {
      const adminsArray = admins.admins;
      for(let i = 0; i < adminsArray.length; i++) {
        adminsArray[i].password = await Register.generatePasswordHash(adminsArray[i].password);
        await Register.insert(adminsArray[i]);
      }
    }
  }
}
