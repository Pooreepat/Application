import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Gender } from 'src/modules/pet/pet.constant';

export type PreferenceDocument = Preference & Document;

@Schema({ timestamps: true })
export class Preference {
  @Prop({ type: Types.ObjectId, ref: 'Profile', required: true })
  _profileId: Types.ObjectId;

  @Prop({ required: true })
  species: string;

  @Prop({ required: true })
  breed: string;

  @Prop({ required: true })
  size: string;

  @Prop([String])
  characteristics: string[];

  @Prop({ type: Number, min: 0, max: 100 })
  energy: number;

  @Prop([String])
  generalHealth: string[];

  @Prop([String])
  tags: string[];

  @Prop({ type: String, enum: Gender })
  gender: Gender;

  @Prop([Date])
  birthdayAt: Date[];
}

export const PreferenceSchema = SchemaFactory.createForClass(Preference);
