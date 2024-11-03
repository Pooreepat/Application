import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { RandomNumber } from 'src/common/utils/randomNumber';

export type NewsDocument = News & Document;

@Schema({
  timestamps: true,
  collection: 'news',
})
export class News {
  @Prop({
    unique: true,
    default: () => RandomNumber.generateRandomNumber(14).toString(),
  })
  _numberId: string;

  @Prop({ type: Types.ObjectId, ref: 'user', required: true })
  _authorId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop([String])
  images: string[];

  @Prop({ type: [String], required: true })
  tags: string[];

  @Prop({ type: String, required: false })
  type: string;

  _id?: Types.ObjectId;
}

export const NewsSchema = SchemaFactory.createForClass(News);
