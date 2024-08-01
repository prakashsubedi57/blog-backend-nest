import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { BlogTagsDto } from './blog-tag.dto';
import { BlogCategoryDto } from './blog-category.dto';
import { Type } from 'class-transformer';

export class CreateBlogDto {
    @ApiProperty({
        description: 'The title of the blog post',
        example: 'Introduction to NestJS',
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiPropertyOptional({
        description: 'Unique identifier for the blog post, auto-generated',
        example: 'introduction-to-nestjs',
    })
    @IsOptional()
    @IsString()
    slug?: string;

    @ApiProperty({
        description: 'A short description of the blog post',
        example: 'A brief introduction to NestJS and its features.',
    })
    @IsNotEmpty()
    @IsString()
    shortDescription: string;

    @ApiProperty({
        description: 'The main content of the blog post',
        example: 'NestJS is a progressive Node.js framework...',
    })
    @IsNotEmpty()
    @IsString()
    content: string;

    @ApiPropertyOptional({
        description: 'Image file for the blog post',
        type: 'string',
        format: 'binary',
    })
    @IsOptional()
    image?: any;

    @ApiProperty({
        description: 'The author of the blog post',
        example: 'John Doe',
    })
    @IsNotEmpty()
    @IsString()
    author: string;

    @ApiPropertyOptional({
        description: 'Image URL of the author',
        type: 'string',
        example: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdKLi4dcySybmV4zRSxD_D14djGszXTzIU9w&s'
    })
    @IsOptional()
    authorImage?:string;

    @ApiProperty({
        description: 'Status of the blog post',
        example: 'Draft',
    })
    @IsNotEmpty()
    @IsEnum(['Draft', 'Published', 'Archived'])
    status: string;

    @ApiProperty({
        description: 'Tags associated with the blog post',
        type: [BlogTagsDto]
    })
    // @IsArray()
    // @ValidateNested({ each: true })
    @Type(() => BlogTagsDto)
    tags: BlogTagsDto[];

    @ApiProperty({
        description: 'Categories of the blog post',
        type: [BlogCategoryDto],
    })
    // @IsArray()
    // @ValidateNested({ each: true })
    @Type(() => BlogCategoryDto)
    categories: BlogCategoryDto[];

    @ApiPropertyOptional({
        description: 'Meta title for SEO',
        example: 'Introduction to NestJS - A Comprehensive Guide',
    })
    @IsOptional()
    @IsString()
    metaTitle?: string;

    @ApiPropertyOptional({
        description: 'Meta description for SEO',
        example: 'Learn about NestJS, a powerful Node.js framework, and how to get started with it.',
    })
    @IsOptional()
    @IsString()
    metaDescription?: string;

    @ApiPropertyOptional({
        description: 'Meta keywords for SEO',
        type: String,
        example: ['NestJS', 'Node.js', 'Backend', 'Framework'],
    })
    @IsOptional()
    @IsString({ each: true })
    metaKeywords?: string[];
}