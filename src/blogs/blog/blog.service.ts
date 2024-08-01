import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './entities/blog.entity';
import { Model, Types } from 'mongoose';
import { slugify } from 'src/utils/slugify';
import { CreateCommentDto } from './dto/create-comment.dto';
import { BlogFilterDto } from './dto/blog-filter.dto';
import { GetBlogsDto } from './dto/get-blogs.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>
  ) { }

  // store blog
  async create(createBlogDto: CreateBlogDto, file?: Express.Multer.File) {
    try {
      const slug = await this.getUniqueSlug(createBlogDto.title);

      if (file) {
        createBlogDto.image = 'blog/' + file.filename;
      }

      if (typeof createBlogDto.tags === 'string') {
        createBlogDto.tags = JSON.parse(createBlogDto.tags);
      }
      if (typeof createBlogDto.categories === 'string') {
        createBlogDto.categories = JSON.parse(createBlogDto.categories);
      }
      if (typeof createBlogDto.metaKeywords === 'string') {
        createBlogDto.metaKeywords = JSON.parse(createBlogDto.metaKeywords);
      }
      const createdBlog = new this.blogModel({ ...createBlogDto, slug });
      return await createdBlog.save();
    } catch (error) {
      console.log(error);
      throw new ConflictException('Blog creation failed');
    }
  }

  // get all blogs
  async findAll() {
    try {
      return await this.blogModel.find()
        .populate(this.getPopulationOptions())
        .exec();
    } catch (error) {
      throw new ConflictException('Blog fetching failed');
    }
  }

  // find blogs
  async findAllBlog(getBlogsDto: GetBlogsDto) {
    try {
      const { page = 1, limit = 10 } = getBlogsDto;

      const pageNumber = page < 1 ? 1 : page;
      const pageSize = limit < 1 ? 10 : limit;

      const skip = (pageNumber - 1) * pageSize;

      const [blogs, total] = await Promise.all([
        this.blogModel.find()
          .skip(skip)
          .limit(pageSize)
          .populate(this.getPopulationOptions())
          .exec(),
        this.blogModel.countDocuments().exec(),
      ]);

      return { blogs, total };
    } catch (error) {
      throw new ConflictException('Blog fetching failed');
    }
  }
  // find published blog
  async findAllPublished() {
    try {
      return await this.blogModel.find({ status: 'Published' })
        .populate(this.getPopulationOptions())
        .exec();
    } catch (error) {
      throw new ConflictException('Blog fetching failed');
    }
  }

  // find similar blog
  async findSimilarBlog(slug: string) {
    try {
      const blogData = await this.blogModel.findOne({ slug }).exec();
      if (!blogData) throw new NotFoundException('Blog not found');

      const tagIds = blogData.tags.map(tag => tag.tag);
      const categoryIds = blogData.categories.map(category => category.category);
      const title = blogData.title;

      return await this.blogModel.find({
        _id: { $ne: blogData._id },
        $or: [
          { 'tags.tag': { $in: tagIds } },
          { 'categories.category': { $in: categoryIds } },
          { title: { $regex: title, $options: 'i' } }
        ]
      })
        .populate(this.getPopulationOptions())
        .limit(5)
        .exec();
    } catch (error) {
      throw new ConflictException('Error finding similar blogs');
    }
  }

  // find blog by slug
  async findOne(slug: string) {
    try {
      const blog = await this.blogModel.findOne({ slug })
        .populate(this.getPopulationOptions())
        .exec();

      if (!blog) throw new NotFoundException('Blog not found');

      const similarBlogs = await this.findSimilarBlog(slug);
      return { blog, similarBlogs };
    } catch (error) {
      throw new ConflictException('Blog retrieval failed');
    }
  }

  // update blog
  async update(id: string, updateBlogDto: UpdateBlogDto, file?: Express.Multer.File) {
    try {
      const blog = await this.blogModel.findById(id);
      if (!blog) throw new NotFoundException('Blog not found');

      if (file) {
        updateBlogDto.image = 'blog/' + file.filename;
      }

      if (typeof updateBlogDto.tags === 'string') {
        updateBlogDto.tags = JSON.parse(updateBlogDto.tags);
      }

      if (typeof updateBlogDto.categories === 'string') {
        updateBlogDto.categories = JSON.parse(updateBlogDto.categories);
      }


      if (blog.title == updateBlogDto.title) {
        updateBlogDto.slug = blog.slug;
      } else {
        updateBlogDto.slug = await this.getUniqueSlug(updateBlogDto.title, id);
      }

      const updatedBlog = await this.blogModel.findByIdAndUpdate(id, updateBlogDto, { new: true });
      if (!updatedBlog) {
        throw new NotFoundException(`Blog not found`);
      }
      return updatedBlog;
    } catch (error) {
      throw new ConflictException(`Blog update failed: ${error.message}`);
    }
  }

  // delete blog
  async remove(id: string) {
    try {
      const result = await this.blogModel.findByIdAndDelete(id);
      if (!result) throw new NotFoundException('Blog not found');
      return result;
    } catch (error) {
      throw new ConflictException('Blog deletion failed');
    }
  }

  // blog filter or search 
  async filterBlogs(filterDto: BlogFilterDto) {
    try {
      const query: any = {};

      if (filterDto.title) {
        query.title = { $regex: filterDto.title, $options: 'i' };
      }

      if (filterDto.categories && filterDto.categories.length > 0) {
        query['categories.category'] = { $in: filterDto.categories };
      }

      if (filterDto.tags && filterDto.tags.length > 0) {
        query['tags.tag'] = { $in: filterDto.tags };
      }
      if (filterDto.author) {
        query.author = filterDto.author;
      }
      if (filterDto.createdDate) {
        query.createdAt = { $gte: new Date(filterDto.createdDate) };
      }
      if (filterDto.updatedDate) {
        query.updatedAt = { $gte: new Date(filterDto.updatedDate) };
      }

      // Sorting
      let sort = {};
      if (filterDto.orderByCreatedDate) {
        sort['createdAt'] = filterDto.orderByCreatedDate === 'asc' ? 1 : -1;
      }
      if (filterDto.orderByUpdatedDate) {
        sort['updatedAt'] = filterDto.orderByUpdatedDate === 'asc' ? 1 : -1;
      }

      // Pagination
      const pageNumber = filterDto.pageNumber || 1;
      const pageSize = filterDto.pageSize || 10;
      const skip = (pageNumber - 1) * pageSize;


      // Execute the query
      const [blogs, total] = await Promise.all([
        this.blogModel.find(query)
          .sort(sort)
          .skip(skip)
          .limit(pageSize)
          .populate(this.getPopulationOptions())
          .exec(),
        this.blogModel.countDocuments(query).exec(),
      ]);

      return { blogs, total };
    } catch (error) {
      throw new ConflictException('Blog filtering failed');
    }
  }

  // comments
  async createComment(userId: string, createCommentDto: CreateCommentDto) {
    try {
      const { blog, content, parentComment } = createCommentDto;

      // Create the new comment
      const thisblog = await this.blogModel.findById(blog);
      thisblog.comments.push({
        content,
        user: userId as any,
        parentComment: parentComment ? new Types.ObjectId(parentComment) : null as any,
      })
      const savedComment = await thisblog.save();
      return savedComment;
    } catch (error) {
      return {
        message: error.message
      }
    }
  }

  // delete blog comment
  async deleteComment(blogId: string, commentId: string) {
    try {
      const blog = await this.blogModel.findById(blogId);

      if (!blog) {
        throw new NotFoundException('Blog not found');
      }

      let deleted = false;

      blog.comments = blog.comments.filter(comment => {
        if (comment._id.toString() === commentId) {
          deleted = true;
          return false;
        }
        return true;
      });
      await blog.save();

      if (deleted == false) {
        throw new NotFoundException('Comment not found');
      }
      return {
        message: 'Comment deleted successfully'
      }
    } catch (error) {
      throw new ConflictException(`Comment deletion failed: ${error.message}`);
    }
  }


  // helper functions
  private async getUniqueSlug(title: string, excludeId?: string): Promise<string> {
    let slug = slugify(title);
    let index = 1;

    while (await this.blogModel.exists({ slug, _id: { $ne: excludeId } })) {
      slug = `${slugify(title)}-${index}`;
      index++;
    }

    return slug;
  }
  private getPopulationOptions() {
    return [
      { path: 'tags', populate: 'tag' },
      { path: 'categories', populate: 'category' },
      { path: 'comments', populate: 'user' }
    ];
  }
}
