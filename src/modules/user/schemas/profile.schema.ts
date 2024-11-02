import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RandomNumber } from 'src/common/utils/randomNumber';
import { PreferenceDocument, PreferenceSchema } from './preference.schema';

export type ProfileDocument = Profile & Document;

@Schema({ timestamps: true, id: false })
export class Profile {
  @Prop({
    unique: true,
    required: false,
    default: () => RandomNumber.generateRandomNumber(14).toString(),
  })
  _numberId?: string;

  @Prop({ type: [String], required: false, default: [] })
  images?: string[];

  @Prop({ type: String, required: true })
  firstname: string;

  @Prop({ type: String, required: true })
  lastname: string;

  @Prop({ type: String, required: false })
  accommodationType?: string;

  @Prop({ type: Number, min: 0, max: 4, default: 0 })
  level?: number;

  @Prop({ type: Number, min: 0, max: 1000, default: 20 })
  distance?: number;

  @Prop({ type: Number, min: 0, max: 24, default: 1 })
  freeTime?: number;

  @Prop({ type: [String], required: false, default: [] })
  personality?: string[];

  @Prop({ type: String, required: false })
  lifestyle?: string;

  @Prop({ type: Date, required: false, default: new Date() })
  birthdayAt: Date;

  @Prop([PreferenceSchema, { required: false, default: [] }])
  preferences?: PreferenceDocument[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
