import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './entities/blog.entity';
import { UserModule } from 'src/users/user.module';
import { UserService } from 'src/users/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),UserModule
  ],
  controllers: [BlogController],
  providers: [BlogService,UserService],
  exports: [MongooseModule]
})
export class BlogModule { }
