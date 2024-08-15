import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { slugify } from 'src/utils/slugify';
import { ResponseService } from 'src/utils/response.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    private readonly responseService: ResponseService,
  ) { }

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      // Destructure the DTO
      const { name, description } = createCategoryDto;

      // Validate required fields
      if (!name) {
        return this.responseService.error('Name is required.');
      }

      // Generate and validate unique slug
      let slug = slugify(name);
      slug = await this.getUniqueSlug(slug);

      // Create and save the category
      const category = new this.categoryModel({ name, description, slug });
      await category.save();

      return this.responseService.success(category, 'Category created successfully', 201);
    } catch (error) {
      return this.responseService.error('Category creation failed', error.message);
    }
  }

  async findAll() {
    try {
      const categories = await this.categoryModel.find().exec();
      return this.responseService.success(categories, 'Categories fetched successfully');
    } catch (error) {
      return this.responseService.error('Category fetching failed', error.message);
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.categoryModel.findById(id).exec();

      if (!category) return this.responseService.error('Category not found');

      return this.responseService.success(category, 'Category retrieved successfully');

    } catch (error) {
      return this.responseService.error('Category retrieval failed', error.message);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoryModel.findById(id).exec();
      if (!category) {
        return this.responseService.error('Category Not Found');
      }

      // Destructure and handle slug
      const { name, description } = updateCategoryDto;
      let slug = category.slug;
      if (name && name !== category.name) {
        slug = await this.getUniqueSlug(slugify(name), id);
      }
      // Update and return the category
      const updateCategory = await this.categoryModel.findByIdAndUpdate(id, { name, description, slug }, { new: true }).exec();
      return this.responseService.success(updateCategory, 'Category updated successfully');
    } catch (error) {
      return this.responseService.error('Category update failed', error.message);
    }
  }

  async remove(id: string) {
    try {
      const result = await this.categoryModel.findByIdAndDelete(id).exec();
      if (!result) {
        return this.responseService.error('Category not found');
      }
      return this.responseService.success(result, 'Category deleted successfully');
    } catch (error) {
      return this.responseService.error('Category deletion failed', error.message);
    }
  }

  private async getUniqueSlug(slug: string, excludeId?: string): Promise<string> {
    let uniqueSlug = slug;
    let index = 1;

    while (await this.categoryModel.exists({ slug: uniqueSlug, _id: { $ne: excludeId } })) {
      uniqueSlug = `${slug}-${index}`;
      index++;
    }
    return uniqueSlug;
  }
}
