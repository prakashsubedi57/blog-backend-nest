import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateLoginDto {
    @ApiProperty({
        description: "Email of the user",
        example: "sadmin@mail.com"
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: "Password of the user",
        example: 'password'
    })
    @IsNotEmpty()
    password: string;
}
