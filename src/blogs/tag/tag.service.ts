import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './schemas/tag.schema';
import { slugify } from 'src/utils/slugify';
import { ResponseService } from 'src/utils/response.service';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private tagModel: Model<Tag>,
    private readonly responseService: ResponseService
  ) { }

  async create(createTagDto: CreateTagDto) {
    try {
      const { name, description } = createTagDto;

      // Validate required fields
      if (!name) {
        return this.responseService.error('Name is required.');
      }

      // Generate and validate unique slug
      let slug = slugify(name);
      slug = await this.getUniqueSlug(slug);

      // Create and save the tag
      const createdTag = new this.tagModel({ name, description, slug });
      await createdTag.save();
      return this.responseService.success(createdTag, 'Tag created successfully', 201);
    } catch (error) {
      return this.responseService.error('Tag creation failed: ', error.message);
    }
  }

  async findAll() {
    try {
      const tags = await this.tagModel.find().exec();
      return this.responseService.success(tags, 'Tags retrieved successfully');
    } catch (error) {
      return this.responseService.error('Tags retrieval failed ', error.message);
    }
  }

  async findOne(id: string) {
    try {
      const tag = await this.tagModel.findById(id).exec();
      if (!tag) {
        return this.responseService.error('Tag not found');
      }
      return tag;
    } catch (error) {
      return this.responseService.error('Tag retrieval failed ', error.message);
    }
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    try {
      const tag = await this.tagModel.findById(id).exec();
      if (!tag) {
        return this.responseService.error('Tag not found');
      }

      // Handle slug change
      const { name, description } = updateTagDto;
      let slug = tag.slug;
      if (name && name !== tag.name) {
        slug = await this.getUniqueSlug(slugify(name), id);
      }

      const updatedTag = await this.tagModel.findByIdAndUpdate(id, { name, description, slug }, { new: true }).exec();
      if (!updatedTag) {
        return this.responseService.error('Tag update failed');
      }
      return updatedTag;
    } catch (error) {
      return this.responseService.error('Tag update failed ', error.message);
    }
  }

  async remove(id: string) {
    try {
      const result = await this.tagModel.findByIdAndDelete(id).exec();
      if (!result) {
        return this.responseService.error('Tag not found');
      }
      return this.responseService.success(result, 'Tag deleted successfully');
    } catch (error) {
      return this.responseService.error('Tag deletion failed ', error.message);
    }
  }

  private async getUniqueSlug(slug: string, excludeId?: string): Promise<string> {
    let uniqueSlug = slug;
    let index = 1;

    while (await this.tagModel.exists({ slug: uniqueSlug, _id: { $ne: excludeId } })) {
      uniqueSlug = `${slug}-${index}`;
      index++;
    }

    return uniqueSlug;
  }
}
