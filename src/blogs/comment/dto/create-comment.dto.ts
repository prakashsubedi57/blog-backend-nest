import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The ID of the blog this comment belongs to',
    example: '66b481818e86646c21794441',
  })
  @IsNotEmpty()
  @IsString()
  blog: string;

  @ApiProperty({
    description: 'The name of the user who made the comment',
    example: 'Anonymous User',
  })
  @IsOptional()
  @IsString()
  user: string;

  @ApiProperty({
    description: 'The content of the comment',
    example: 'This is a great blog post!',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'ID of the parent comment if this is a reply',
    example: '605c72ef4d8a5c001f64727f',
    required: false,
  })
  @IsOptional()
  @IsString()
  parentComment: string;
}
