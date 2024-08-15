import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TagsService } from './tag.service';
import { Tag } from './schemas/tag.schema';

@ApiTags('tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiResponse({ status: 201, description: 'The tag has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createTagDto: CreateTagDto) {
    try {
      return await this.tagService.create(createTagDto);
    } catch (error) {
      throw new ConflictException('Tag creation failed');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({ status: 200, description: 'List of all tags' })
  async findAll() {
    try {
      return await this.tagService.findAll();
    } catch (error) {
      throw new ConflictException('Failed to fetch tags');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific tag by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the tag to retrieve' })
  @ApiResponse({ status: 200, description: 'The tag has been successfully retrieved.' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async findOne(@Param('id') id: string) {
    try {
      return await this.tagService.findOne(id);
    } catch (error) {
      throw new ConflictException('Failed to fetch tag');
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a tag by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the tag to update' })
  @ApiResponse({ status: 200, description: 'The tag has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    try {
      return await this.tagService.update(id, updateTagDto);
    } catch (error) {
      throw new ConflictException('Tag update failed');
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tag by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the tag to delete' })
  @ApiResponse({ status: 200, description: 'The tag has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async remove(@Param('id') id: string) {
    try {
      return await this.tagService.remove(id);
    } catch (error) {
      throw new ConflictException('Tag deletion failed');
    }
  }
}
