import { Controller, Body, ValidationPipe, Post, Get, Query, Put, Param } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto, UpdateArticleDto, CreateArticleFromUrlDto } from './articles.entity';
import { ArticleQueryRaw } from './articles.query';
import { Schema } from 'mongoose';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) { }

  @Get()
  findall(@Query() articleQueryRaw: ArticleQueryRaw) {
    return this.articlesService.findAll(articleQueryRaw);
  }

  @Post()
  create(@Body(ValidationPipe) creteArticleDto: CreateArticleDto) {
    return this.articlesService.create(creteArticleDto);
  }

  @Post('fromURL')
  createFromUrl(@Body(ValidationPipe) createArticleFromUrlDto: CreateArticleFromUrlDto) {
    return this.articlesService.createFromUrl(createArticleFromUrlDto);
  }

  @Put(':id')
  update(
    @Param('id') id: Schema.Types.ObjectId,
    @Body(ValidationPipe) updateArticleDto: UpdateArticleDto
  ) {
    return this.articlesService.update(id, updateArticleDto);
  }
}
