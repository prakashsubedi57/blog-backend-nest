import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({
        description: 'The name of the category',
        example: 'Technology',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({
        description: 'A brief description of the category',
        example: 'Posts related to technology and gadgets',
    })
    @IsOptional()
    @IsString()
    description: string;
}
