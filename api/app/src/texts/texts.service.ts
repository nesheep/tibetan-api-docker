import { Injectable } from '@nestjs/common';
import {
  TextDocument,
  CreateTextDto,
  Text,
  ResponseTextsDto,
  ResponseTextByKeywordDto,
  ResponseTextsByKeywordDto,
  ResponseKwicDto,
  ResponseKwicsDto
} from './texts.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TSHEG_OR_SHAD } from "../app.constants";

@Injectable()
export class TextsService {
  constructor(
    @InjectModel('Text') private readonly textModel: Model<TextDocument>
  ) { }

  async create(
    createTextDto: CreateTextDto
  ): Promise<TextDocument | any> {
    const created_at = Date.now();
    const createText: Text = {
      ...createTextDto,
      created_at
    }
    try {
      const createTextDocument = new this.textModel(createText);
      const textDoument = await createTextDocument.save()
      console.info(`createText 成功 ${textDoument.code}`)
      return textDoument;
    } catch (error) {
      console.error(`createText 失敗 ${createTextDto.code} ${error.message}`)
      return error;
    }
  }

  async findAll(): Promise<ResponseTextsDto> {
    const data = await this.textModel.find();
    const total = data.length;
    console.info(`findAllText ${total}`);
    return { data, total }
  }

  async findAllByKeyword(
    keyword: string
  ): Promise<ResponseTextsByKeywordDto> {
    const halfWidthKeyword = keyword.replace('？', '?');
    const keywordReg = new RegExp(halfWidthKeyword);
    const documentQuery = this.textModel.aggregate([
      { $match: { text: keywordReg } }
    ])
    documentQuery.lookup({
      from: 'articles',
      localField: 'article',
      foreignField: '_id',
      as: 'article'
    })
    documentQuery.project({
      '_id': 0,
      'code': 1,
      'text': 1,
      'article.url': 1,
      'article.date': 1
    })
    documentQuery.unwind({
      path: '$article',
      preserveNullAndEmptyArrays: true
    })
    const data = await documentQuery.exec() as ResponseTextByKeywordDto[];
    const total = data.length;
    console.info(`findAllByKeyword ${halfWidthKeyword} ${total}`);
    return {
      data,
      total,
      keyword: halfWidthKeyword
    }
  }

  async findAllKwic(
    keyword: string,
    length: number,
    limit: number,
    shuffle: boolean
  ): Promise<ResponseKwicsDto> {
    const texts = await this.findAllByKeyword(keyword);
    const responseKwics = this.createResponseKwics(texts, length, limit, shuffle);
    console.info(`findAllKwic ${responseKwics.keyword} ${responseKwics.total}`);
    return responseKwics;
  }

  private shuffleArray([...array]) {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private tibetanSubstring(
    text: string,
    start?: number,
    end?: number
  ) {
    if (!text) {
      return text;
    }
    let subText = text;
    if (end && end < text.length) {
      const match = subText.substring(0, end).match(new RegExp(`.+[${TSHEG_OR_SHAD}]+`));
      if (match) {
        subText = `${match[0]}་་་་་་་་`;
      }
    }
    if (start && 0 < start) {
      const match = subText.substring(start).match(new RegExp(`[${TSHEG_OR_SHAD}]+.+`));
      if (match) {
        subText = `་་་་་་་་${match[0].substring(1)}`;
      }
    }
    return subText;
  }

  private createResponseKwics = (
    texts: ResponseTextsByKeywordDto,
    length: number,
    limit: number,
    shuffle: boolean
  ): ResponseKwicsDto => {
    const keyword = texts.keyword;
    const keywordReg = new RegExp(keyword);
    const allData: ResponseKwicDto[] = [];
    texts.data.forEach(inputText => {
      const text = inputText.text;
      let from = 0;
      let isMatch = true;
      while (isMatch) {
        const match = text.substring(from).match(keywordReg);
        if (match) {
          const matchText = match[0];
          const matchIndex = from + match.index!;
          const matchEndIndex = matchIndex + matchText.length;
          from += match.index! + 1;
          const left = text.substring(0, matchIndex);
          const right = text.substring(matchEndIndex);
          const result: ResponseKwicDto = {
            code: inputText.code,
            text: {
              left: this.tibetanSubstring(left, left.length - length),
              match: matchText,
              right: this.tibetanSubstring(right, 0, length)
            },
            article: inputText.article
          }
          allData.push(result);
        } else {
          isMatch = false;
        }
      }
    })
    const total = allData.length;
    const shuffledData = shuffle ? this.shuffleArray(allData) : allData
    const data = total <= limit ? shuffledData : shuffledData.slice(0, limit);
    return { data, total, keyword };
  }
}
