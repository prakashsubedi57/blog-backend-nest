import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateNewsletterDto {
    @ApiProperty({
        description: 'The email of the newsletter',
        example: 'example@example.com',
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email:string;
}
