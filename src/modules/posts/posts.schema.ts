import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EStatusPosts } from './posts.constant';
import { RandomNumber } from 'src/common/utils/randomNumber';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: Types.ObjectId, ref: 'user', required: true })
  _authorId: Types.ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop([{ type: Types.ObjectId, ref: 'user' }])
  likes: Types.ObjectId[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

@Schema({ timestamps: true })
export class Post {
  @Prop({
    unique: true,
    default: () => RandomNumber.generateRandomNumber(14).toString(),
  })
  _numberId: string;

  @Prop({ type: Types.ObjectId, ref: 'user', required: true })
  _authorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'user', required: false })
  _receiverId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop([String])
  images: string[];

  @Prop([{ type: Types.ObjectId, ref: 'user' }])
  likes?: Types.ObjectId[];

  @Prop([CommentSchema])
  comments?: Comment[];

  @Prop({ default: false })
  isHidden: boolean;

  @Prop({ type: [String], required: true })
  tags: string[];
  
  @Prop({
    type: {
      type: String,
      default: 'Point',
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location: {
    type: string;
    coordinates: number[];
  };

  @Prop({ type: String, enum: EStatusPosts, default: EStatusPosts.HELP_NEEDED })
  status: EStatusPosts;
}

export const PostSchema = SchemaFactory.createForClass(Post);
