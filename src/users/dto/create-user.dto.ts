import { Schema } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

@Schema()
export class CreateUserDto {
    @ApiProperty({
        example: 'test',
        description: 'name'
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: 'test@mail.com',
        description: 'Email of the user'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'test',
        description: 'Password of the user'
    })
    @IsString()
    password: string;

}
