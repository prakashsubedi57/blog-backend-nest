import { Module } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { NewsletterController } from './newsletter.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Newsletter, newsletterSchema } from './schemas/newsletter.schema';
import { ResponseService } from 'src/utils/response.service';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Newsletter.name, schema: newsletterSchema }])
  ],
  controllers: [NewsletterController],
  providers: [NewsletterService,ResponseService,MailerService],
  exports:[MongooseModule]
})
export class NewsletterModule { }
