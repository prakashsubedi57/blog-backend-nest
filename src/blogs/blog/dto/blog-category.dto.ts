import { ApiProperty } from "@nestjs/swagger";

export class BlogCategoryDto {
    @ApiProperty({
        description: 'The ID of the category',
        example: '66ac6bfa9c713207b04696cd'
    })
    category: string;
}