import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, IsEnum, IsMongoId } from 'class-validator';
import { BlogStatus } from 'src/utils/blog-status.enum';

export class CreateBlogDto {
    @ApiProperty({
        description: 'The title of the blog post',
        example: 'How to Prepare for the NCLEX',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiPropertyOptional({
        description: 'A short description of the blog post',
        example: 'This blog post will help you prepare for the NCLEX exam...',
    })
    @IsString()
    @IsOptional()
    shortDescription: string;

    @ApiPropertyOptional({
        description: 'The full content of the blog post',
        example: '<p>This is the content of the blog...</p>',
    })
    @IsString()
    @IsOptional()
    content: string;

    @ApiPropertyOptional({
        description: 'URL to the image associated with the blog post',
        example: 'https://example.com/image.jpg',
    })
    @IsString()
    @IsOptional()
    image: string;

    @ApiProperty({
        description: 'The ID of the author creating the blog post',
        example: '66a23324a24ac3508d7bec94',
    })
    @IsMongoId()
    @IsNotEmpty()
    author: string;

    @ApiPropertyOptional({
        type: [String],
        description: 'An array of tag IDs associated with the blog post',
        example: ['66b47f6a00fefed97aff5aab', '66b480a18c4436fa53507b74'],
    })
    @IsArray()
    @IsMongoId({ each: true })
    @IsOptional()
    tags: string[];

    @ApiPropertyOptional({
        type: [String],
        description: 'An array of category IDs associated with the blog post',
        example: ['66b47e6ba5d3097fc013f33e', '66b47e76a5d3097fc013f341'],
    })
    @IsArray()
    @IsMongoId({ each: true })
    @IsOptional()
    categories: string[];

    @ApiPropertyOptional({
        enum: BlogStatus,
        description: 'The status of the blog post',
        example: BlogStatus.Draft,
    })
    @IsEnum(BlogStatus)
    @IsOptional()
    status: BlogStatus;

    @ApiPropertyOptional({
        description: 'The meta title for SEO',
        example: 'Nclex in Nepal',
    })
    @IsString()
    @IsOptional()
    metaTitle: string;

    @ApiPropertyOptional({
        description: 'The meta description for SEO',
        example: 'Learn how to prepare effectively for the NCLEX exam...',
    })
    @IsString()
    @IsOptional()
    metaDescription: string;

    @ApiPropertyOptional({
        type: [String],
        description: 'An array of meta keywords for SEO',
        example: ['NCLEX', 'Exam Preparation', 'Nursing'],
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    metaKeywords: string[];

    @ApiPropertyOptional({
        description: 'The og title for SEO',
        example: 'Nclex in Nepal',
    })
    @IsString()
    @IsOptional()
    ogTitle: string;

    @ApiPropertyOptional({
        description: 'The og description for SEO',
        example: 'Learn how to prepare effectively for the NCLEX exam...',
    })
    @IsString()
    @IsOptional()
    ogDescription: string;

    @ApiPropertyOptional({
        description: 'An link of og image for SEO',
        example: 'https://example.com/image.jpg',
    })
    @IsString()
    @IsOptional()
    ogImage: string;
}
