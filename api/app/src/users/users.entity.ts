import { Schema, Document } from "mongoose";
import {
  IsString,
  MinLength,
  MaxLength,
  IsBoolean,
} from "class-validator";

export interface User {
  name: string;
  password: string;
  is_admin: boolean;
  created_at: number;
}

export const UserSchema = new Schema({
  name: { type: Schema.Types.String, required: true, unique: true },
  password: { type: Schema.Types.String, required: true },
  is_admin: { type: Schema.Types.Boolean, required: true },
  created_at: { type: Schema.Types.Number, required: true }
})

export interface UserDocument extends Document, User { }

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  readonly name: string = '';
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  readonly password: string = '';
  @IsBoolean()
  readonly is_admin: boolean = false;
}

export interface ResponseUserDto extends User {
  _id: Schema.Types.ObjectId;
}

export interface ResponseUsersDto {
  data: ResponseUserDto[];
  total: number;
}
