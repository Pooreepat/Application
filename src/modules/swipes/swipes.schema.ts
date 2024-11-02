import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SwipeDocument = Swipe & Document;

@Schema({
  timestamps: true,
  collection: 'swipe',
})
export class Swipe {
  @Prop({ type: Types.ObjectId, ref: 'user', required: true })
  _adopterId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'pet', required: true })
  _petId: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isLiked: boolean;

  @Prop({ type: Boolean, default: false })
  isActioned: boolean;

  _id?: Types.ObjectId;
}

export const SwipeSchema = SchemaFactory.createForClass(Swipe);
