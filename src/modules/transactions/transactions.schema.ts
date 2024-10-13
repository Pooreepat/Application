import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RandomNumber } from 'src/common/utils/randomNumber';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({
    unique: true,
    default: () => RandomNumber.generateRandomNumber(14).toString(),
  })
  _numberId: string;

  @Prop({ type: Types.ObjectId, ref: 'Match', required: true })
  _matchId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Profile', required: true })
  _profile1Id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Profile', required: true })
  _profile2Id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Pet' })
  _petId: Types.ObjectId;

  @Prop([String])
  images: string[];

  _id?: Types.ObjectId;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
