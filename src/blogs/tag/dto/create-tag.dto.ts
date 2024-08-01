import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    description: 'The name of the tag',
    example: 'Technology',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Unique identifier for the tag, auto-generated',
    example: 'technology',
    required: false,
  })
  @IsOptional()
  @IsString()
  slug: string;

  @ApiProperty({
    description: 'A brief description of the tag',
    example: 'Posts related to technology and gadgets',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
