import { IsInt, IsOptional, Min } from 'class-validator';

export class GetBlogsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
