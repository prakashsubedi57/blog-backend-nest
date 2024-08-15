import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schemas/blog.schema';
import { UserModule } from 'src/users/user.module';
import { UserService } from 'src/users/user.service';
import { ResponseService } from 'src/utils/response.service';
import { FileUploadService } from 'src/common/services/file-upload.service';
import { NewsletterService } from '../newsletter/newsletter.service';
import { MailerService } from 'src/mailer/mailer.service';
import { NewsletterModule } from '../newsletter/newsletter.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema }
    ]), UserModule,NewsletterModule
  ],
  controllers: [BlogController],
  providers: [BlogService, FileUploadService, UserService, ResponseService, NewsletterService, MailerService],
  exports: [MongooseModule]
})
export class BlogModule { }

