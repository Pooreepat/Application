import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ENewsType } from './news.constant';

@Schema()
export class News extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop([String])
  images: string[];

  @Prop({ type: String, enum: ENewsType, required: true })
  type: ENewsType;
}

export const NewsSchema = SchemaFactory.createForClass(News);
