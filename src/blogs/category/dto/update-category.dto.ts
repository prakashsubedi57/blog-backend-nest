import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
    @ApiProperty({
        description: 'The name of the category',
        example: 'Technology',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Unique identifier for the category, auto-generated',
        example: 'technology',
        required: false,
    })
    @IsOptional()
    @IsString()
    slug?: string;

    @ApiProperty({
        description: 'A brief description of the category',
        example: 'Posts related to technology and gadgets',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        description: 'Image file for the category',
        type: 'string',
        format: 'binary',
    })
    @IsOptional()
    image?: string;  
}

