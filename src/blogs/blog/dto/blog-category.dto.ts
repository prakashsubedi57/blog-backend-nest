import { ApiProperty } from "@nestjs/swagger";

export class BlogCategoryDto {
    @ApiProperty({
        description: 'The ID of the category',
        example: ''
    })
    category: string;
}