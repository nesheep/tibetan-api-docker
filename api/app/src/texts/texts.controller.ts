import { Controller, Get, Body, ValidationPipe, Post, Param, Query, UseGuards } from '@nestjs/common';
import { TextsService } from './texts.service';
import { CreateTextDto } from './texts.entity';
import { kwicQueryRaw, kwicQuery } from './texts.query';
import { AuthGuard } from '@nestjs/passport';

@Controller('texts')
export class TextsController {
  constructor(private readonly textsService: TextsService) { }

  @Get()
  findAll() {
    return this.textsService.findAll();
  }

  @Get('kwic/:keyword')
  @UseGuards(AuthGuard('jwt'))
  findAllKwic(
    @Param('keyword') keyword: string,
    @Query() queryRaw: kwicQueryRaw
  ) {
    const query = new kwicQuery(queryRaw);
    return this.textsService.findAllKwic(keyword, query.length, query.limit, query.shuffle);
  }

  @Get('keyword/:keyword')
  findAllByKeyword(@Param('keyword') keyword: string) {
    return this.textsService.findAllByKeyword(keyword);
  }

  @Post()
  create(@Body(ValidationPipe) createTextDto: CreateTextDto) {
    return this.textsService.create(createTextDto);
  }
}
