import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ArticleSchema } from './articles.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { TextsModule } from 'src/texts/texts.module';

@Module({
  imports: [
    TextsModule,
    MongooseModule.forFeature([{ name: 'Article', schema: ArticleSchema }])
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService]
})
export class ArticlesModule { }
