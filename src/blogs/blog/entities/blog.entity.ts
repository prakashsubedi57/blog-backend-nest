import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { BlogCategory, BlogCategorySchema, BlogComment, BlogCommentSchema, BlogTags, BlogTagSchema } from "./blog.subschemas";

@Schema({ timestamps: true })
export class Blog extends Document {
    @Prop()
    title: string;

    @Prop({ unique: true })
    slug: string;

    @Prop()
    shortDescription: string;

    @Prop()
    content: string;

    @Prop()
    image: string;

    @Prop()
    author: string;

    @Prop()
    authorImage: string;

    @Prop({ type: [BlogTagSchema] })
    tags: BlogTags[];

    @Prop({ type: [BlogCategorySchema] })
    categories: BlogCategory[];

    @Prop({ enum: ['Draft', 'Published', 'Archived'], default: 'Draft' })
    status: string;

    @Prop()
    metaTitle: string;

    @Prop()
    metaDescription: string;

    @Prop([String])
    metaKeywords: string[];

    @Prop({ type: [BlogCommentSchema] })
    comments: BlogComment[];
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
