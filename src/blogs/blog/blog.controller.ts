import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, UseGuards, Req, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileUploadInterceptor } from 'src/common/interceptors/file-upload.interceptor';
import { JwtAuthGuard } from 'src/auth/authencation/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { BlogFilterDto } from './dto/blog-filter.dto';
import { GetBlogsDto } from './dto/get-blogs.dto';

@ApiTags('blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseInterceptors(FileUploadInterceptor('blog'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateBlogDto })
  async create(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.blogService.create(createBlogDto, file);
  }

  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @Get('get/all')
  async getBlogs(@Query() getBlogsDto: GetBlogsDto) {
    const { blogs, total } = await this.blogService.findAllBlog(getBlogsDto);
    return { blogs, total };
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.blogService.findOne(slug);
  }

  @Patch(':id')
  @UseInterceptors(FileUploadInterceptor('blog'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateBlogDto })
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
  @ApiBearerAuth('JWT')
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
}
