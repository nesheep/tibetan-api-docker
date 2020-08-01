import { Module } from '@nestjs/common';
import { TextsController } from './texts.controller';
import { TextsService } from './texts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TextSchema } from './texts.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Text', schema: TextSchema }])],
  controllers: [TextsController],
  providers: [TextsService],
  exports: [TextsService]
})
export class TextsModule { }
