import { Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from "./auth.entity";

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) { }

  @Post('login')
  login(@Query() user: LoginDto) {
    return this.authservice.login(user);
  }
}
