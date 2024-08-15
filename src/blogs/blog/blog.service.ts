import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './schemas/blog.schema';
import { Model } from 'mongoose';
import { slugify } from 'src/utils/slugify';
import { BlogFilterDto } from './dto/blog-filter.dto';
import { ResponseService } from 'src/utils/response.service';
import { MailerService } from 'src/mailer/mailer.service';
import { Newsletter } from '../newsletter/schemas/newsletter.schema';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(Newsletter.name) private newsletterModule: Model<Newsletter>,
    private readonly responseService: ResponseService,
    private readonly emailService: MailerService,
  ) { }

  // Store blog
  async create(createBlogDto: CreateBlogDto) {
    try {
      const {
        title, shortDescription, content, image,
        author, tags, categories, status, metaTitle,
        metaDescription, metaKeywords, ogTitle,
        ogDescription, ogImage
      } = createBlogDto;

      // Validate required fields
      if (!title || !content || !author || !image) {
        return this.responseService.error('Title, content, image, and author are required fields.');
      }

      // Generate a unique slug
      const slug = await this.getUniqueSlug(title);

      // Create a new blog document
      const createdBlog = new this.blogModel({
        title,
        shortDescription,
        content,
        image,
        author,
        tags,
        categories,
        status,
        metaTitle,
        metaDescription,
        metaKeywords,
        ogTitle,
        ogDescription,
        ogImage,
        slug
      });

      // Save the blog document to the database
      await createdBlog.save();


      // send email to newsletter subscribers
      if(status === 'Published'){
        await this.sendemailtonewsletter(createdBlog);
      }

      return this.responseService.success(createdBlog, 'Blog created successfully', 201);
    } catch (error) {
      return this.responseService.error('Blog creation failed', error.message);
    }
  }

  // Get all blogs
  async findAll() {
    try {
      const blogs = await this.blogModel.find()
        .populate(this.getPopulationOptions())
        .exec();
      return this.responseService.success(blogs, 'Blogs fetched successfully');
    } catch (error) {
      return this.responseService.error('Blog fetching failed', error.message);
    }
  }

  // Find published blogs
  async findAllPublished() {
    try {
      const blogs = await this.blogModel.find({ status: 'Published' })
        .populate(this.getPopulationOptions())
        .exec();
      return this.responseService.success(blogs, 'Published blogs fetched successfully');
    } catch (error) {
      return this.responseService.error('Blog fetching failed', error.message);
    }
  }

  // Find similar blogs
  async findSimilarBlog(slug: string) {
    try {
      const blogData = await this.blogModel.findOne({ slug }).exec();
      if (!blogData) throw new NotFoundException('Blog not found');

      const tagIds = blogData.tags.map(tag => tag);
      const categoryIds = blogData.categories.map(category => category);
      const title = blogData.title;

      const similarBlogs = await this.blogModel.find({
        _id: { $ne: blogData._id },
        $or: [
          { 'tags': { $in: tagIds } },
          { 'categories': { $in: categoryIds } },
          { title: { $regex: title, $options: 'i' } }
        ],
        status: 'Published'
      })
        .populate(this.getPopulationOptions())
        .limit(5)
        .exec();

      return this.responseService.success(similarBlogs, 'Similar blogs fetched successfully');
    } catch (error) {
      return this.responseService.error('Error finding similar blogs', error.message);
    }
  }

  // Find blog by slug
  async findOne(slug: string) {
    try {
      const blog = await this.blogModel.findOne({ slug })
        .populate(this.getPopulationOptions())
        .exec();

      if (!blog) return this.responseService.error('Blog not found');

      // Update blog views
      blog.views += 1;
      await blog.save();

      const similarBlogs = await this.findSimilarBlog(slug);
      return this.responseService.success({ blog, similarBlogs }, 'Blog retrieved successfully');
    } catch (error) {
      return this.responseService.error('Blog retrieval failed', error.message);
    }
  }

  // Update blog
  async update(id: string, updateBlogDto: UpdateBlogDto) {
    try {
      const blog = await this.blogModel.findById(id);
      if (!blog) return this.responseService.error('Blog not found');

      this.parseStringifiedFields(updateBlogDto);
      let slug = blog.slug;
      if (blog.title !== updateBlogDto.title) {
        slug = await this.getUniqueSlug(updateBlogDto.title, id);
      }

      const updatedBlog = await this.blogModel.findByIdAndUpdate(id, { ...updateBlogDto, slug }, { new: true });
      if (!updatedBlog) return this.responseService.error('Blog update failed');

      // send email to newsletter subscribers
      if(blog.status != 'Published' && updateBlogDto.status === 'Published' ){
        await this.sendemailtonewsletter(updatedBlog);
      }
      return this.responseService.success(updatedBlog, 'Blog updated successfully');
    } catch (error) {
      return this.responseService.error('Blog update failed', error.message);
    }
  }

  // Delete blog
  async remove(id: string) {
    try {
      const blog = await this.blogModel.findByIdAndDelete(id);
      if (!blog) return this.responseService.error('Blog not found');
      return this.responseService.success(blog, 'Blog deleted successfully');
    } catch (error) {
      return this.responseService.error('Blog deletion failed', error.message);
    }
  }

  // Filter or search blogs
  async filterBlogs(filterDto: BlogFilterDto) {
    try {
      const query: any = this.buildFilterQuery(filterDto);
      const sort = this.buildSortOptions(filterDto);
      const { pageNumber, pageSize } = this.getPaginationOptions(filterDto);
      const skip = (pageNumber - 1) * pageSize;

      const [blogs, total] = await Promise.all([
        this.blogModel.find(query)
          .sort(sort)
          .skip(skip)
          .limit(pageSize)
          .populate(this.getPopulationOptions())
          .exec(),
        this.blogModel.countDocuments(query).exec(),
      ]);

      return this.responseService.success({ blogs, total }, 'Blogs filtered successfully');
    } catch (error) {
      return this.responseService.error('Blog filtering failed', error.message);
    }
  }

  // Helper methods
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
      { path: 'tags' },
      { path: 'categories' },
      { path: 'author' },
      { path: 'comments' }
    ];
  }

  private parseStringifiedFields(dto: any) {
    if (typeof dto.tags === 'string') {
      dto.tags = JSON.parse(dto.tags);
    }
    if (typeof dto.categories === 'string') {
      dto.categories = JSON.parse(dto.categories);
    }
    if (typeof dto.metaKeywords === 'string') {
      dto.metaKeywords = JSON.parse(dto.metaKeywords);
    }
  }

  private buildFilterQuery(filterDto: BlogFilterDto) {
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
    if (filterDto.status) {
      query.status = filterDto.status;
    }
    return query;
  }

  private buildSortOptions(filterDto: BlogFilterDto) {
    const sort: any = {};

    if (filterDto.orderByCreatedDate) {
      sort['createdAt'] = filterDto.orderByCreatedDate === 'asc' ? 1 : -1;
    }
    if (filterDto.orderByUpdatedDate) {
      sort['updatedAt'] = filterDto.orderByUpdatedDate === 'asc' ? 1 : -1;
    }

    return sort;
  }

  private getPaginationOptions(filterDto: BlogFilterDto) {
    const pageNumber = filterDto.pageNumber || 1;
    const pageSize = filterDto.pageSize || 10;
    return { pageNumber, pageSize };
  }

  private async sendemailtonewsletter(blog:any) {
    // send email to newsletter
    try {
      const subscribers = await this.newsletterModule.find().exec();
      for (const subscriber of subscribers) {
        await this.emailService.sendMailToNewBlog(
          subscriber.email,
          'New Blog is Posted by Nclex Nepal',
          blog.title
        );
      }
    } catch (error) {
      return ;
    }
  }
}
