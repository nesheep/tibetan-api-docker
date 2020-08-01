import { IsString, IsNumber, IsBoolean } from "class-validator";
import { Schema, Document } from "mongoose";

export interface Article {
  code: string;
  url: string;
  raw_text: string;
  date: number;
  genre: string;
  analyzed: boolean;
  created_at: number;
}

export const ArticleSchema = new Schema({
  code: { type: Schema.Types.String, required: true, unique: true },
  url: { type: Schema.Types.String, required: true },
  raw_text: { type: Schema.Types.String, required: true },
  date: { type: Schema.Types.Number, default: 0 },
  genre: { type: Schema.Types.String, default: '' },
  analyzed: { type: Schema.Types.Boolean, default: false },
  created_at: { type: Schema.Types.Number, required: true }
})

export interface ArticleDocument extends Document, Article { }

class CreateArticleDtoBase {
  @IsString()
  readonly code: string = '';
  @IsString()
  readonly url: string = '';
  @IsNumber()
  readonly date: number = 0;
  @IsString()
  readonly genre: string = '';
}

export class CreateArticleDto extends CreateArticleDtoBase {
  @IsString()
  readonly raw_text: string = '';
}

export class CreateArticleFromUrlDto extends CreateArticleDtoBase { }

export class UpdateArticleDto {
  @IsBoolean()
  readonly analyzed: boolean = false;
}

export interface ResponseArticleDto extends Article {
  _id: Schema.Types.ObjectId;
}

export interface ResponseArticlesDto {
  data: ResponseArticleDto[],
  total: number;
}
