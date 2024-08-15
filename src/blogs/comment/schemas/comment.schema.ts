import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Blog } from "src/blogs/blog/schemas/blog.schema";
import { User } from "src/users/entities/user.entity";

@Schema({ timestamps: true })
export class Comment extends Document {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' })
    blog: Blog;

    @Prop({ default: 'Anonymous' })
    user: string;

    @Prop()
    content: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
    parentComment: Comment;

    @Prop({ default: false })
    approved: boolean;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);