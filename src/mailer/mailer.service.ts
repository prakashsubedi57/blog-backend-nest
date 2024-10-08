import { Injectable, ConflictException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { readFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      // secure: process.env.MAIL_SECURE,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }
  async sendMail(to: string, subject: string, text: string, html?: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        text,
        html
      });
    } catch (error) {
      throw new ConflictException('Email sending failed: ' + error.message);
    }
  }

  async sendMailToNewSubscriber(to: string, subject: string, text: string, html?: string) {
    try {
      const htmlTemplate = await this.getHtmlTemplateNewSubs();

      await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        text,
        html: htmlTemplate,
      });
    } catch (error) {
      throw new ConflictException('Email sending failed: ' + error.message);
    }
  }
  async sendMailToNewBlog(to: string, subject: string, text: string,blog:any) {
    try {
      const htmlTemplate = await this.getHtmlTemplateNewsletter(blog);

      await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        text,
        html: htmlTemplate,
      });
    } catch (error) {
      throw new ConflictException('Email sending failed: ' + error.message);
    }
  }

  private async getHtmlTemplateNewSubs(): Promise<string> {
    const filePath = join('src/', 'templates', 'new-subscriber.html');
    return await readFile(filePath, 'utf-8');
  }

  private async getHtmlTemplateNewsletter(blog: any): Promise<string> {
    const filePath = join('src/', 'templates', 'new-blog.html');
    let template = await readFile(filePath, 'utf-8');

    // Replace placeholders with actual blog data
    template = template.replace('{{blogTitle}}', blog.title);
    template = template.replace('{{imageUrl}}', blog.image);
    template = template.replace('{{shortDescription}}', blog.shortDescription);
    template = template.replace('{{blogUrl}}', `https://nclexinnepal.com/blog/${blog.slug}`);

    return template;
  }

}
