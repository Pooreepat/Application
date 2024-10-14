import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MatchStatus } from './matches.constant';
import { RandomNumber } from 'src/common/utils/randomNumber';

export type MatchDocument = Match & Document;

@Schema({ timestamps: true })
export class Match {
  @Prop({
    unique: true,
    default: () => RandomNumber.generateRandomNumber(14).toString(),
  })
  _numberId: string;

  @Prop({ type: Types.ObjectId, ref: 'Profile', required: true })
  _profile1Id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Profile', required: true })
  _profile2Id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Pet' })
  _petId: Types.ObjectId;

  @Prop({ type: String, enum: MatchStatus })
  status: MatchStatus;

  @Prop({ type: Boolean, default: false })
  isTransaction: boolean;

  _id?: Types.ObjectId;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
