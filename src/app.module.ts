import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/user.module';
import { LoginModule } from './auth/login.module';
import { CategoryModule } from './blogs/category/category.module';
import { TagModule } from './blogs/tag/tag.module';
import { BlogModule } from './blogs/blog/blog.module';
import { ConfigModule } from '@nestjs/config';
import { CommentModule } from './blogs/comment/comment.module';
import { NewsletterModule } from './blogs/newsletter/newsletter.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    UserModule,
    LoginModule,
    CategoryModule,
    TagModule,
    CommentModule,
    BlogModule,
    NewsletterModule,
    MailerModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }