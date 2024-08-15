import { ApiProperty } from "@nestjs/swagger";

export class CreateMailerDto {
    @ApiProperty({
        description: 'Email',
        example: 'example@example.com',
    })
    to: string;

    @ApiProperty({
        description: 'Subject',
        example: 'Hello',
    })
    subject: string;


    @ApiProperty({
        description: 'Body',
        example: 'Hello',
    })
    text: string;

    @ApiProperty({
        description: 'Attachments',
        example: '<h1>HII</h1>',
    })
    html?: string

}
