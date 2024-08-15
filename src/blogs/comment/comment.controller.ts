import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'The comment has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createCommentDto: CreateCommentDto) {
    try {
      return await this.commentService.create(createCommentDto);
    } catch (error) {
      throw new HttpException(
        `Failed to create comment: ${error.message}`,
        error.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({ status: 200, description: 'List of all comments' })
  async findAll() {
    try {
      return await this.commentService.findAll();
    } catch (error) {
      throw new HttpException(
        `Failed to get comments: ${error.message}`,
        error.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific comment by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the comment to retrieve' })
  @ApiResponse({ status: 200, description: 'The comment has been successfully retrieved.' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async findOne(@Param('id') id: string) {
    try {
      return await this.commentService.findOne(id);
    } catch (error) {
      throw new HttpException(
        `Failed to get comment: ${error.message}`,
        error.status || HttpStatus.NOT_FOUND
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a comment by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the comment to update' })
  @ApiResponse({ status: 200, description: 'The comment has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    try {
      return await this.commentService.update(id, updateCommentDto);
    } catch (error) {
      throw new HttpException(
        `Failed to update comment: ${error.message}`,
        error.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the comment to delete' })
  @ApiResponse({ status: 200, description: 'The comment has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async remove(@Param('id') id: string) {
    try {
      return await this.commentService.remove(id);
    } catch (error) {
      throw new HttpException(
        `Failed to delete comment: ${error.message}`,
        error.status || HttpStatus.NOT_FOUND
      );
    }
  }
}
