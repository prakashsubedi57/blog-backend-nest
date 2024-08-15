import { Injectable } from '@nestjs/common';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Newsletter } from './schemas/newsletter.schema';
import { Model } from 'mongoose';
import { ResponseService } from 'src/utils/response.service';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectModel(Newsletter.name) private newsletterModel: Model<Newsletter>,
    private readonly responseService: ResponseService,
    private readonly emailService: MailerService
  ) { }
  async create(createNewsletterDto: CreateNewsletterDto) {
    try {
      const email = createNewsletterDto.email;
      const findnewsletter = await this.newsletterModel.find({ email }).exec();
      if (findnewsletter.length > 0) {
        return this.responseService.success('Newsletter already exists');
      }
      const newnewslettercontroller = await new this.newsletterModel({ email }).save();

      // send email about thatnk you for subscription
      this.emailService.sendMailToNewSubscriber(email, 'Thank you for the subscription', 'Nclex Nepal');

      return this.responseService.success(newnewslettercontroller, 'Newsletter created successfully', 201);
    } catch (error) {
      return this.responseService.error('Error while creating Newsletter', error.message, 500);
    }
  }

  async findAll() {
    try {
      const newsletters = await this.newsletterModel.find().exec();
      return this.responseService.success(newsletters, 'Newsletters retrieved successfully', 200);
    } catch (error) {
      return this.responseService.error('Error while retrieving Newsletters', error.message);
    }
  }

  async findOne(id: string) {
    try {
      const newsletter = await this.newsletterModel.findById(id).exec();
      if (!newsletter) {
        return this.responseService.error('Newsletter not found', 'Newsletter not found', 404);
      }
      return this.responseService.success(newsletter, 'Newsletter retrieved successfully', 200);

    } catch (error) {
      return this.responseService.error('Error while retrieving Newsletter', error.message);
    }
  }

  async update(id: string, updateNewsletterDto: UpdateNewsletterDto) {
    try {
      const email = updateNewsletterDto.email;
      if (!email) {
        return this.responseService.error('Email is required');
      }
      const newsletter = await this.newsletterModel.findByIdAndUpdate(id, updateNewsletterDto, {
        new: true
      }).exec();
      if (!newsletter) {
        return this.responseService.error('Newsletter not found', 'Newsletter not found', 404);
      }
      return this.responseService.success(newsletter, 'Newsletter updated successfully', 200);
    } catch (error) {
      return this.responseService.error('Error while updating Newsletter', error.message);
    }
  }

  async remove(id: string) {
    try {
      const newsletter = await this.newsletterModel.findByIdAndDelete(id).exec();
      if (!newsletter) {
        return this.responseService.error('Newsletter not found', 'Newsletter not found', 404);
      }
      return this.responseService.success(newsletter, 'Newsletter deleted successfully', 200);
    } catch (error) {
      return this.responseService.error('Error while deleting Newsletter', error.message);
    }
  }

}
