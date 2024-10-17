import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EStatusPosts } from './posts.constant';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: Types.ObjectId, ref: 'Profile', required: true })
  _profileId: Types.ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  likes: Types.ObjectId[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: Types.ObjectId, ref: 'Profile', required: true })
  _profileId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Profile', required: false })
  _receiverId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], required: true })
  images?: string[];

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  likes?: Types.ObjectId[];

  @Prop([CommentSchema])
  comments?: Comment[];

  @Prop({ default: false })
  isHidden: boolean;

  @Prop([String])
  tags?: string[];

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
