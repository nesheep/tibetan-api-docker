import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";

import { mongodb } from "./app.constants";
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { TextsModule } from './texts/texts.module';

@Module({
  imports: [
    MongooseModule.forRoot(mongodb, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    }),
    AuthModule,
    UsersModule,
    ArticlesModule,
    TextsModule
  ]
})
export class AppModule { }
