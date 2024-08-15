import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Newsletter extends Document {
    @Prop({ unique: true, require: true })
    email: string;
}

export const newsletterSchema = SchemaFactory.createForClass(Newsletter);