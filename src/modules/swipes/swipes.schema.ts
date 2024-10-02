import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SwipeType } from './swipes.constant';

export type SwipeDocument = Swipe & Document;

@Schema({ timestamps: true })
export class Swipe {
  @Prop({ type: Types.ObjectId, ref: 'Profile', required: true })
  _swiperId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Pet', required: true })
  _swipedPetId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Profile', required: true })
  _swipedId: Types.ObjectId;

  @Prop({ type: String, enum: SwipeType })
  swipeType: SwipeType;
}

export const SwipeSchema = SchemaFactory.createForClass(Swipe);
