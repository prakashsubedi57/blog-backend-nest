import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new newsletter' })
  @ApiResponse({ status: 201, description: 'The newsletter has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createNewsletterDto: CreateNewsletterDto) {
    try {
      return await this.newsletterService.create(createNewsletterDto);
    } catch (error) {
      throw new ConflictException('Tag creation failed');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all newsletter' })
  @ApiResponse({ status: 200, description: 'List of all newsletters.' })
  async findAll() {
    try {
      return await this.newsletterService.findAll();
    } catch (error) {
      throw new ConflictException('Failed to fetch newsletters');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific Newletter by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the newletter to retrieve' })
  @ApiResponse({ status: 200, description: 'The newletter has been successfully retrieved.' })
  @ApiResponse({ status: 404, description: 'Newletter not found' })
  async findOne(@Param('id') id: string) {
    try {
      return await this.newsletterService.findOne(id);
    } catch (error) {
      throw new ConflictException('Failed to fetch newsletter');
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a  newsletter' })
  @ApiResponse({ status: 201, description: 'The newsletter has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async update(@Param('id') id: string, @Body() updateNewsletterDto: UpdateNewsletterDto) {
    try {
      return await this.newsletterService.update(id, updateNewsletterDto);
    } catch (error) {
      throw new ConflictException('Failed to update newsletter');
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a newsletter by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the newsletter to delete' })
  @ApiResponse({ status: 200, description: 'The newsletter has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'newsletter not found' })
  async remove(@Param('id') id: string) {
    return await this.newsletterService.remove(id);
  }
}
