import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Schema } from 'mongoose';
import { ArticleDocument, CreateArticleDto, ResponseArticlesDto, UpdateArticleDto, Article, CreateArticleFromUrlDto } from './articles.entity';
import { InjectModel } from '@nestjs/mongoose';
import axios from "axios";
import * as cheerio from "cheerio";
import { ArticleQueryRaw, ArticleQuery } from './articles.query';
import { TextsService } from '../texts/texts.service';
import { TIBETAN_LETTER, TSHEG_OR_SHAD } from "../app.constants";
import { CreateTextDto } from 'src/texts/texts.entity';
import { TextDocument } from "../texts/texts.entity";

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel('Article')
    private readonly articleModel: Model<ArticleDocument>,
    private readonly textsService: TextsService
  ) { }

  async create(
    createArticleDto: CreateArticleDto
  ): Promise<ArticleDocument | any> {
    const created_at = Date.now();
    const createArticle: Article = {
      ...createArticleDto,
      analyzed: false,
      created_at
    }
    try {
      const createArticleDocument = new this.articleModel(createArticle);
      const articleDoument = await createArticleDocument.save();
      console.info(`createArticle 成功 ${articleDoument.code}`);
      const textTotal = await this.articleToTexts(articleDoument);
      if (!textTotal) {
        console.info('no text');
        return articleDoument;
      }
      console.info(`create ${textTotal} texts`);
      const updateArticleDocument = await this.update(
        articleDoument._id,
        { analyzed: true }
      )
      return updateArticleDocument;
    } catch (error) {
      console.error(`createArticle 失敗 ${createArticleDto.code} ${error.message}`);
      return error;
    }
  }

  async createFromUrl(
    createArticleFromUrlDto: CreateArticleFromUrlDto
  ): Promise<ArticleDocument | any> {
    const html = await this.getArticleHtml(createArticleFromUrlDto.url);
    if (!html) {
      return 'no html';
    }
    const text = this.getArticleRawText(html);
    const data: CreateArticleDto = {
      ...createArticleFromUrlDto,
      raw_text: text
    }
    return await this.create(data);
  }

  async findAll(
    articleQueryRaw: ArticleQueryRaw
  ): Promise<ResponseArticlesDto> {
    const articleQuery = new ArticleQuery(articleQueryRaw);
    type Options = {
      code?: RegExp;
      analyzed?: boolean;
    }
    let options: Options = {};
    if (articleQuery.code) {
      options.code = new RegExp(articleQuery.code);
    }
    if (typeof articleQuery.analyzed !== 'string') {
      options.analyzed = articleQuery.analyzed;
    }
    const data = await this.articleModel.find(options);
    const total = data.length;
    console.info(`findAllArticle ${total}`);
    return { data, total }
  }

  async update(
    id: Schema.Types.ObjectId,
    updateArticleDto: UpdateArticleDto
  ): Promise<ArticleDocument> {
    const updateArticleDocument = await this.articleModel.findByIdAndUpdate(id, updateArticleDto).exec();
    if (!updateArticleDocument) {
      throw new NotFoundException();
    }
    return updateArticleDocument;
  }

  // WEBページからHTMLを取得
  private async getArticleHtml(url: string): Promise<string | void> {
    try {
      console.info(`リクエスト ${url}`);
      const res = await axios.get<string>(url);
      return res.data;
    } catch (error) {
      console.error(error.message);
    }
  }

  // HTMLからテキストを取得
  private getArticleRawText(data: string) {
    const $ = cheerio.load(data);
    const text = $('body').text();
    return text;
  }

  // 音節数(tshegとshadの数)をカウント
  private countSyllables(text: string) {
    const tshegOrShadReg = new RegExp(`[${TSHEG_OR_SHAD}]`, 'g');
    const tshegOrshads = text.match(tshegOrShadReg);
    if (!tshegOrshads) {
      return 0;
    }
    return tshegOrshads.length;
  }

  // 文字列の先頭末尾のチベット文字以外を削除
  private cleanUpStartAndEnd(text: string) {
    const startReg = new RegExp(`^[^${TIBETAN_LETTER}]+`);
    const startMatch = text.match(startReg);
    let startIndex = 0;
    if (startMatch) {
      startIndex = startMatch[0].length;
    }
    const endReg = new RegExp(`[^${TIBETAN_LETTER}]+$`);
    const endMatch = text.match(endReg);
    if (endMatch && endMatch.index) {
      const endIndex = endMatch.index;
      return text.substring(startIndex, endIndex);
    }
    return text.substring(startIndex);
  }

  // articleを解析してtextを保存
  private async articleToTexts(
    articleDocument: ArticleDocument
  ): Promise<number> {
    let count = 0;
    const splitRawTexts = articleDocument.raw_text.split('\n');
    for (const splitRawText of splitRawTexts) {
      const syllables = this.countSyllables(splitRawText);
      if (syllables < 50) {
        continue
      }
      count++;
      const code = `${articleDocument.code}${('0000' + count).slice(-4)}`;
      const article = articleDocument._id;
      const text = this.cleanUpStartAndEnd(splitRawText);
      const placed_at = count;
      const createTextDto: CreateTextDto = { code, article, text, syllables, placed_at };
      const textDocument = await this.textsService.create(createTextDto) as TextDocument;
      if (!textDocument._id) {
        count--;
      }
    }
    return count;
  }
}
