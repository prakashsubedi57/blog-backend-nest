import { ApiProperty } from "@nestjs/swagger";

export class BlogTagsDto {
    @ApiProperty({
        description: 'The ID of the tag',
        example: ''
    })
    tag: string;
}