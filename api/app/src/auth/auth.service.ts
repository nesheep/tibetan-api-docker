import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcryptjs";
import { UsersService } from '../users/users.service';
import { LoginDto } from "./auth.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) { }

  async validateUser({ name, password }: LoginDto) {
    const user = await this.usersService.findOne(name);
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('認証に失敗しました');
    }
    return isValid;
  }

  async login(user: LoginDto) {
    if (await this.validateUser(user)) {
      const payload = { name: user.name }
      return {
        'access_token': this.jwtService.sign(payload)
      }
    }
  }
}
