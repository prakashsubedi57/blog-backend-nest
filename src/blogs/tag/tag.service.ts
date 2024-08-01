import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { slugify } from 'src/utils/slugify';

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<Tag>) { }

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    try {
      let slug = slugify(createTagDto.name);
      slug = await this.getUniqueSlug(slug);
      const createdTag = new this.tagModel({ ...createTagDto, slug });
      return await createdTag.save();
    } catch (error) {
      throw new ConflictException('Tag creation failed');
    }
  }

  async findAll() {

    try {
      return this.tagModel.find().exec();
    } catch (error) {
      throw new NotFoundException('Tags not found');
    }
  }

  async findOne(id: string) {
    const tag = await this.tagModel.findById(id).exec();
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    try {
      const updateData = { ...updateTagDto };
      if (updateTagDto.name) {
        let slug = slugify(updateTagDto.name);
        slug = await this.getUniqueSlug(slug, id);
        updateData.slug = slug;
      }
      const updatedTag = await this.tagModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).exec();
      if (!updatedTag) {
        throw new NotFoundException('Tag not found');
      }
      return updatedTag;
    } catch (error) {
      throw new ConflictException('Tag update failed');
    }
  }

  async remove(id: string) {
    try {
      const result = await this.tagModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException('Tag not found');
      }
      return result;
    } catch (error) {
      throw new ConflictException('Tag deletion failed');
    }
  }

  private async getUniqueSlug(slug: string, excludeId?: string) {
    let uniqueSlug = slug;
    let index = 1;

    while (await this.tagModel.exists({ slug: uniqueSlug, _id: { $ne: excludeId } })) {
      uniqueSlug = `${slug}-${index}`;
      index++;
    }

    return uniqueSlug;
  }
}
