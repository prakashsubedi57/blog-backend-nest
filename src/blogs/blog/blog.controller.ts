import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, UseGuards, Req, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileUploadInterceptor } from 'src/common/interceptors/file-upload.interceptor';
import { JwtAuthGuard } from 'src/auth/authencation/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { BlogFilterDto } from './dto/blog-filter.dto';
import { FileUploadService } from 'src/common/services/file-upload.service';

@ApiTags('blog')
@Controller('blog')
export class BlogController {

  constructor(private readonly blogService: BlogService, private readonly fileUploadService: FileUploadService) { }

  @Post()
  @UseInterceptors(FileUploadInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() img: Express.Multer.File,
  ) {
    return this.blogService.create(createBlogDto, img);
  }

  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.blogService.findOne(slug);
  }

  @Patch(':id')
  @UseInterceptors(FileUploadInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.blogService.update(id, updateBlogDto, file);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }

  @Get('get/published')
  findPublished() {
    return this.blogService.findAllPublished();
  }

  @Post('filter')
  @ApiBody({ type: BlogFilterDto })
  async findFilter(@Body() query: BlogFilterDto) {
    return this.blogService.filterBlogs(query);
  }

  @Post('comment')
  @ApiBearerAuth('XYZ')
  @UseGuards(JwtAuthGuard)
  async comment(@Req() req, @Body() createCommentDto: CreateCommentDto) {
    const userId = req.user._id;
    return this.blogService.createComment(userId, createCommentDto);
  }

  @Delete(':blogId/delete-comment/:commentId')
  async deleteComment(
    @Param('blogId') blogId: string,
    @Param('commentId') commentId: string,
  ) {
    return this.blogService.deleteComment(blogId, commentId);
  }

  @Post('upload/file')
  @UseInterceptors(FileUploadInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (file) {
      const imageUrl = await this.fileUploadService.uploadImage(file);
      return { imageUrl };
    } else {
      return { message: 'No file uploaded' };
    }
  }
}