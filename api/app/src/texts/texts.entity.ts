import { Schema, Document } from "mongoose";
import { IsString, IsNumber } from "class-validator";

export interface Text {
  code: string;
  article: string;
  text: string;
  syllables: number;
  placed_at: number;
  created_at: number;
}

export const TextSchema = new Schema({
  code: { type: Schema.Types.String, required: true, unique: true },
  article: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
  text: { type: Schema.Types.String, required: true },
  syllables: { type: Schema.Types.Number, required: true },
  placed_at: { type: Schema.Types.Number, required: true },
  created_at: { type: Schema.Types.Number, required: true }
})

export interface TextDocument extends Document, Text { }

export class CreateTextDto {
  @IsString()
  readonly code: string = '';
  @IsString()
  readonly article: string = '';
  @IsString()
  readonly text: string = '';
  @IsNumber()
  readonly syllables: number = 0;
  @IsNumber()
  readonly placed_at: number = 0;
}

export interface ResponseTextDto extends Text {
  _id: Schema.Types.ObjectId;
}

export interface ResponseTextsDto {
  data: ResponseTextDto[];
  total: number;
}

export interface ResponseTextByKeywordDto {
  code: string;
  text: string;
  article: {
    url: string;
    date: number;
  }
}

export interface ResponseTextsByKeywordDto {
  data: ResponseTextByKeywordDto[];
  total: number;
  keyword: string;
}

export interface ResponseKwicDto {
  code: string;
  text: {
    left: string;
    match: string;
    right: string;
  }
  article: {
    url: string;
    date: number;
  }
}

export interface ResponseKwicsDto {
  data: ResponseKwicDto[];
  total: number;
  keyword: string;
}
