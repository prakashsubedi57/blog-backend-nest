import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";
import { Category } from "src/blogs/category/entities/category.entity";
import { Tag } from "src/blogs/tag/entities/tag.entity";
import { User } from "src/users/entities/user.entity";

@Schema()
export class BlogTags {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' })
    tag: Tag;
}

@Schema()
export class BlogCategory {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
    category: Category;
}

@Schema({timestamps: true})
export class BlogComment {
    [x: string]: any;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;

    @Prop()
    content: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
    parentComment: BlogComment;
}

export const BlogTagSchema = SchemaFactory.createForClass(BlogTags);
export const BlogCategorySchema = SchemaFactory.createForClass(BlogCategory);
export const BlogCommentSchema = SchemaFactory.createForClass(BlogComment);
