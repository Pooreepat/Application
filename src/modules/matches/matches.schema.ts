import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RandomNumber } from 'src/common/utils/randomNumber';

export type MatchDocument = Match & Document;

@Schema({
  timestamps: true,
  collection: 'match',
})
export class Match {
  @Prop({
    unique: true,
    default: () => RandomNumber.generateRandomNumber(14).toString(),
  })
  _numberId: string;

  @Prop({ type: Types.ObjectId, ref: 'user' })
  _caretakerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'user' })
  _adopterId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'pet' })
  _petId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'swipe' })
  _swipeId: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isTransaction: boolean;

  _id?: Types.ObjectId;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
