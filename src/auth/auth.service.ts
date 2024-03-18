import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Register } from './auth.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from 'src/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  public async register(body: RegisterDto) {
    const { fullName, phone, login, password } = body;
    let user = await Register.isUserExist(phone, login);

    if(user) {
      throw new HttpException('Пользователь уже существует', HttpStatus.CONFLICT);
    }

    user = new Register();

    user.fullName = fullName;
    user.phone = phone;
    user.login = login;
    user.password = await Register.generatePasswordHash(password);
    user.isAdmin = false;
    const result = await Register.save(user)
    const accessToken = await this.jwtService.sign({id: result.userId, email: result.login});
    delete result.password;
    return {
      user: result,
      accessToken
    }
  }

  public async login(body) {
    const user = await Register.loginProccess(body.login, body.password);
    if(!user) {
      throw new HttpException('Введены неверные данные', HttpStatus.UNAUTHORIZED);
    }

    const accessToken = await this.jwtService.sign({id: user.userId, email: user.login});

    return {accessToken};
  }

  public async jwtDecode(token) {
    const payload = this.jwtService.decode(token.slice(7));
    const user = await Register.findOne({
      where: {
        userId: payload.id
      }
    })
    delete payload.iat;
    delete payload.exp;
    return {...payload, isAdmin: user.isAdmin};
  }
}
