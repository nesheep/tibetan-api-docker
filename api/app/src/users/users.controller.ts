import { Controller, Get, Post, Body, ValidationPipe, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './users.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService){ }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':name')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('name') name: string) {
    return this.usersService.findOne(name);
  }

  @Post()
  create(@Body(ValidationPipe) createuserDto: CreateUserDto) {
    return this.usersService.create(createuserDto);
  }
}
