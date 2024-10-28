import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AccommodationType } from './profile.constant';
import { RandomNumber } from 'src/common/utils/randomNumber';

export type ProfileDocument = Profile & Document;

@Schema({ timestamps: true })
export class Profile {
  @Prop({
    unique: true,
    default: () => RandomNumber.generateRandomNumber(14).toString(),
  })
  _numberId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  _userId: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  phone: string;

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ type: String, required: true })
  firstname: string;

  @Prop({ type: String, required: true })
  lastname: string;

  @Prop({ type: Date, reuqired: true })
  birthdayAt: Date;

  @Prop({ type: String, enum: AccommodationType })
  accommodationType: AccommodationType;

  @Prop({ type: Number, min: 0, max: 4 })
  level: number;

  @Prop({ type: Number, min: 0, max: 1000 })
  distance: number;

  @Prop({ type: Number, min: 0, max: 24 })
  freeTime: number;

  @Prop({ type: [String] })
  personality: string[];

  @Prop({ type: String })
  lifestyle: string;

  @Prop({ type: Date })
  lastLogin: Date;

  @Prop({ type: String, unique: true })
  identityCard: string;

  _id?: Types.ObjectId;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
