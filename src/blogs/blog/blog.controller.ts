import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileUploadInterceptor } from 'src/common/interceptors/file-upload.interceptor';
import { JwtAuthGuard } from 'src/auth/authencation/jwt-auth.guard';
import { BlogFilterDto } from './dto/blog-filter.dto';
import { FileUploadService } from 'src/common/services/file-upload.service';

@ApiTags('blog')
@Controller('blog')
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new blog post with an optional image upload' })
  @ApiResponse({ status: 201, description: 'The blog has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async create(@Body() createBlogDto: CreateBlogDto) {
    try {
      return await this.blogService.create(createBlogDto);
    } catch (error) {
      throw new HttpException(
        `Failed to create blog post: ${error.message}`,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing blog post with an optional image upload' })
  @ApiResponse({ status: 200, description: 'Blog post successfully updated.' })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  async update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    try {
      return await this.blogService.update(id, updateBlogDto);
    } catch (error) {
      throw new HttpException(
        `Failed to update blog post: ${error.message}`,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all blog posts' })
  @ApiResponse({ status: 200, description: 'List of all blog posts.' })
  async findAll() {
    try {
      return await this.blogService.findAll();
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve blog posts: ${error.message}`,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Retrieve a blog post by its slug' })
  @ApiResponse({ status: 200, description: 'Blog post found.' })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  async findOne(@Param('slug') slug: string) {
    try {
      return await this.blogService.findOne(slug);
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve blog post: ${error.message}`,
        error.status || HttpStatus.NOT_FOUND,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a blog post' })
  @ApiResponse({ status: 200, description: 'Blog post successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  async remove(@Param('id') id: string) {
    try {
      return await this.blogService.remove(id);
    } catch (error) {
      throw new HttpException(
        `Failed to delete blog post: ${error.message}`,
        error.status || HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('get/published')
  @ApiOperation({ summary: 'Retrieve all published blog posts' })
  @ApiResponse({ status: 200, description: 'List of all published blog posts.' })
  async findPublished() {
    try {
      return await this.blogService.findAllPublished();
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve published blog posts: ${error.message}`,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('filter')
  @ApiOperation({ summary: 'Filter blog posts based on criteria' })
  @ApiResponse({ status: 200, description: 'Filtered list of blog posts.' })
  @ApiBody({ type: BlogFilterDto })
  async findFilter(@Body() query: BlogFilterDto) {
    try {
      return await this.blogService.filterBlogs(query);
    } catch (error) {
      throw new HttpException(
        `Failed to filter blog posts: ${error.message}`,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('upload/file')
  @ApiOperation({ summary: 'Upload an image for the blog' })
  @ApiResponse({ status: 201, description: 'Image successfully uploaded.' })
  @ApiResponse({ status: 400, description: 'No file uploaded.' })
  @UseInterceptors(FileUploadInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    try {
      if (file) {
        const imageUrl = await this.fileUploadService.uploadImage(file);
        return { imageUrl };
      } else {
        throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException(
        `Failed to upload image: ${error.message}`,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
