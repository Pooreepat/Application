import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AccommodationType } from './profile.constant';
import { RandomNumber } from 'src/common/utils/randomNumber';

export type ProfileDocument = Profile & Document;

@Schema({ timestamps: true })
export class Profile {
  @Prop({
    required: true,
    unique: true,
    default: () => RandomNumber.generateRandomNumber(6).toString(),
  })
  _numberId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  _userId: Types.ObjectId;

  @Prop({ required: true })
  phone: string;

  @Prop([String])
  images: string[];

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop()
  birthdayAt: Date;

  @Prop({ type: String, enum: AccommodationType })
  accommodationType: AccommodationType;

  @Prop({ type: Number, min: 0, max: 4 })
  level: number;

  @Prop()
  distance: number;

  @Prop()
  freeTime: number;

  @Prop([String])
  personality: string[];

  @Prop()
  lifestyle: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
