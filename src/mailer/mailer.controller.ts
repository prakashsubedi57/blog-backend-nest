import { Controller, Post, Body, ConflictException } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateMailerDto } from './dto/create-mailer.dto';


@ApiTags('send-email')
@Controller('mail')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('send-email')
  async sendMailToNewSubscriber(@Body() emailDto: CreateMailerDto) {
    try {
      await this.mailerService.sendMailToNewSubscriber(emailDto.to, emailDto.subject, emailDto.text, emailDto.html);
      return { message: 'Email sent successfully' };
    } catch (error) {
      throw new ConflictException('Failed to send email');
    }
  }
}
