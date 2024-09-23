import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MatchStatus } from './matches.constant';

export type MatchDocument = Match & Document;

@Schema({ timestamps: true })
export class Match {
  @Prop({ required: true, unique: true })
  _numberId: string;

  @Prop({ type: Types.ObjectId, ref: 'Profile', required: true })
  _profile1Id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Profile', required: true })
  _profile2Id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Pet' })
  _petId: Types.ObjectId;

  @Prop({ type: String, enum: MatchStatus })
  status: MatchStatus;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
