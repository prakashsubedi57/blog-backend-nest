import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { BlogModule } from '../blog/blog.module';
import { ResponseService } from 'src/utils/response.service';

@Module({
  imports:[
    MongooseModule.forFeature([{name:Comment.name,schema:CommentSchema}]),
    BlogModule
  ],
  controllers: [CommentController],
  providers: [CommentService,ResponseService],
})
export class CommentModule {}
