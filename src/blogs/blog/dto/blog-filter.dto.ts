import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsArray, IsDateString, IsIn, IsPositive } from "class-validator";

export class BlogFilterDto {
    @ApiProperty({
        description: 'Search Query',
        example: 'Search Query',
        required: false
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({
        description: 'Blog category',
        example: ['66a22ea08f19774479b16ef4', '66a22ecd8f19774479b16ef7'],
        required: false
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    categories?: string[];

    @ApiProperty({
        description: 'Blog tags',
        example: ['66a23125a24ac3508d7bec5b', '66a2313aa24ac3508d7bec5e'],
        required: false
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @ApiProperty({
        description: 'Blog author',
        example: 'Blog author',
        required: false
    })
    @IsOptional()
    @IsString()
    author?: string;

    @ApiProperty({
        description: 'Blog created date',
        example: '2021-01-01',
        required: false
    })
    @IsOptional()
    @IsDateString()
    createdDate?: string;

    @ApiProperty({
        description: 'Blog updated date',
        example: '2021-01-02',
        required: false
    })
    @IsOptional()
    @IsDateString()
    updatedDate?: string;

    @ApiProperty({
        description: 'Order by created date',
        example: 'asc',
        required: false,
        enum: ['asc', 'desc']
    })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    orderByCreatedDate?: 'asc' | 'desc';

    @ApiProperty({
        description: 'Order by updated date',
        example: 'desc',
        required: false,
        enum: ['asc', 'desc']
    })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    orderByUpdatedDate?: 'asc' | 'desc';

    @ApiProperty({
        description:'Page Number',
        example: 1,
    })
    @IsOptional()
    @IsPositive()
    pageNumber?: number;

    @ApiProperty({
        description: 'Page Size',
        example: 10,
    })
    @IsOptional()
    @IsPositive()
    pageSize?: number;
}
