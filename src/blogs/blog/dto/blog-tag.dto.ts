import { ApiProperty } from "@nestjs/swagger";

export class BlogTagsDto {
    @ApiProperty({
        description: 'The ID of the tag',
        example: '66ac6ef69c713207b0469742'
    })
    tag: string;
}