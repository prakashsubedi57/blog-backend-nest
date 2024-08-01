import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Tag {
    @Prop()
    name: string;

    @Prop({ unique: true, required: true })
    slug: string;

    @Prop()
    description: string;
}
export const TagSchema = SchemaFactory.createForClass(Tag);