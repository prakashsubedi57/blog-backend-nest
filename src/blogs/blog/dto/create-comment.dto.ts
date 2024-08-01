import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
    @ApiProperty({
        example: '1',
    })
    @IsString()
    blog: string;

    @ApiProperty({
        example: 'nice blog',
    })
    @IsString()
    content: string;

    @ApiProperty({
        example: '1',
    })
    @IsOptional()
    @IsString()
    parentComment?:string;
}
