import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './entities/category.entity';
import { slugify } from 'src/utils/slugify';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) { }

  async create(createCategoryDto: CreateCategoryDto, image: Express.Multer.File) {
    try {
      if (!image) {
        throw new BadRequestException('Image file is required');
      }
      let slug = slugify(createCategoryDto.name);
      slug = await this.getUniqueSlug(slug);
      const category = new this.categoryModel({ ...createCategoryDto, image: 'blog/' + image.filename, slug });
      return category.save();
    } catch (error) {
      return {
        message: error.message
      }
    }

  }

  findAll() {
    try {
      return this.categoryModel.find();
    } catch (error) {
      return {
        message: error.message
      }
    }
  }

  findOne(id: string) {
    try {
      return this.categoryModel.findById(id);
    } catch (error) {
      return {
        message: error.message
      }
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, image?: Express.Multer.File) {
    try {
      const category = await this.categoryModel.findById(id);
      if (!category) {
        throw new BadRequestException('Category not found');
      }

      if (image) {
        updateCategoryDto.image = image.filename;
      }

      if (category.name == updateCategoryDto.name) {
        updateCategoryDto.slug = category.slug;
      } else {
        let slug = slugify(updateCategoryDto.name);
        slug = await this.getUniqueSlug(slug, id);
        updateCategoryDto.slug = slug;
      }

      return await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true });
    } catch (error) {
      return {
        message: error.message
      }
    }
  }

  remove(id: string) {
    try {
      return this.categoryModel.findByIdAndDelete(id);
    } catch (error) {
      return {
        message: error.message
      }
    }
  }

  private async getUniqueSlug(slug: string, excludeId?: string) {
    let uniqueSlug = slug;
    let index = 1;

    while (await this.categoryModel.exists({ slug: uniqueSlug, _id: { $ne: excludeId } })) {
      uniqueSlug = `${slug}-${index}`;
      index++;
    }

    return uniqueSlug;
  }
}
