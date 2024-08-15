import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Category } from "src/blogs/category/schemas/category.schema";
import { Tag } from "src/blogs/tag/schemas/tag.schema";
import { User } from "src/users/entities/user.entity";
import { BlogStatus } from "src/utils/blog-status.enum";
import { Comment } from "src/blogs/comment/schemas/comment.schema";

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

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    author: User;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }])
    tags: Tag[];

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }])
    categories: Category[];

    @Prop({ enum: BlogStatus, default: BlogStatus.Draft })
    status: BlogStatus;

    @Prop()
    metaTitle: string;

    @Prop()
    metaDescription: string;

    @Prop([String])
    metaKeywords: string[];

    @Prop()
    ogTItle: string;

    @Prop()
    ogDescription: string;

    @Prop()
    ogImage: string;

    @Prop({ default: 0 })
    views: number;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }])
    comments: Comment[];
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
