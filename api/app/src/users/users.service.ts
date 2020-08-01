import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, CreateUserDto, User, ResponseUsersDto } from './users.entity';
import * as bcrypt from "bcryptjs";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>
  ) { }

  async create(
    createUserDto: CreateUserDto
  ): Promise<UserDocument | any> {
    const created_at = Date.now();
    const createUser: User = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 12),
      created_at
    }
    try {
      const createUserDocument = new this.userModel(createUser);
      const userDoument = await createUserDocument.save()
      console.info(`createUser 成功 ${userDoument.name}`)
      return userDoument;
    } catch (error) {
      console.error(`createUser 失敗 ${createUser.name} ${error.message}`)
      return error;
    }
  }

  async findAll(): Promise<ResponseUsersDto> {
    const data = await this.userModel.find();
    const total = data.length;
    console.info(`findAllUser ${total}`);
    return { data, total }
  }

  async findOne(name: string) {
    const user = await this.userModel.findOne({ name }).exec();
    if (!user) {
      throw new NotFoundException('ユーザー名が見つかりません');
    }
    return user;
  }
}
