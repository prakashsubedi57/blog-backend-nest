import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Blog } from '../blog/schemas/blog.schema';
import { ResponseService } from 'src/utils/response.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    private readonly responseService: ResponseService,
  ) { }

  // Create a new comment
  async create(createCommentDto: CreateCommentDto) {
    try {
      const { blog, content, parentComment, user } = createCommentDto;

      // Validate necessary data
      if (!blog || !content) {
        return this.responseService.error('Blog ID and content are required');
      }

      // Check if the blog exists
      const gotBlog = await this.blogModel.findById(blog);
      if (!gotBlog) {
        return this.responseService.error('Blog not found', null, 404);
      }

      // If the comment is a reply, check if the parent comment exists
      if (parentComment) {
        const parent = await this.commentModel.findById(parentComment);
        if (!parent) {
          return this.responseService.error('Parent comment not found', null, 404);
        }
      }

      // Create a new comment
      const comment = new this.commentModel({ blog, content, parentComment, user });

      // Initialize or update blog's comments array
      gotBlog.comments = gotBlog.comments || [];
      gotBlog.comments.push(comment);

      await comment.save();

      await gotBlog.save();

      return this.responseService.success(comment, 'Comment created successfully');
    } catch (error) {
      console.log(error)
      return this.responseService.error(`Error creating comment: ${error.message}`);
    }
  }

  // Retrieve all comments
  async findAll() {
    try {
      const comments = await this.commentModel.find().populate('blog').exec();
      return this.responseService.success(comments, 'Comments retrieved successfully');
    } catch (error) {
      return this.responseService.error(`Error finding comments: ${error.message}`);
    }
  }

  // Retrieve a specific comment by its ID
  async findOne(id: string) {
    try {
      const comment = await this.commentModel.findById(id).populate('blog').exec();
      if (!comment) {
        return this.responseService.error('Comment not found', null, 404);
      }
      return this.responseService.success(comment, 'Comment retrieved successfully');
    } catch (error) {
      return this.responseService.error(`Error finding comment: ${error.message}`);
    }
  }

  // Update a specific comment by its ID
  async update(id: string, updateCommentDto: UpdateCommentDto) {
    try {
      const { content } = updateCommentDto;

      // Validate necessary data
      if (!content) {
        return this.responseService.error('Content are required');
      }

      // Find the comment by ID
      const comment = await this.commentModel.findById(id);
      if (!comment) {
        return this.responseService.error('Comment not found', null, 404);
      }

      // Update the comment and return the updated document
      const updatedComment = await this.commentModel.findByIdAndUpdate(id, {
        content
      }, { new: true })
        .exec();

      return this.responseService.success(updatedComment, 'Comment updated successfully');
    } catch (error) {
      return this.responseService.error(`Error updating comment: ${error.message}`);
    }
  }

  // Delete a specific comment by its ID
  async remove(id: string) {
    try {
      // Find the comment by ID
      const comment = await this.commentModel.findById(id).exec();
      if (!comment) {
        return this.responseService.error('Comment not found', null, 404);
      }

      // Remove the comment from the associated blog's comments array
      await this.blogModel.findByIdAndUpdate(
        comment.blog,
        { $pull: { comments: comment._id } }
      ).exec();

      // Delete the comment document
      const result = await this.commentModel.findByIdAndDelete(id).exec();
      if (!result) {
        return this.responseService.error('Error deleting comment', null, 500);
      }

      return this.responseService.success(null, 'Comment deleted successfully');
    } catch (error) {
      return this.responseService.error(`Error removing comment: ${error.message}`);
    }
  }
}
