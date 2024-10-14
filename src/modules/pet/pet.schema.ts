import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Gender, Species, Status } from './pet.constant';
import { RandomNumber } from 'src/common/utils/randomNumber';

export type PetDocument = Pet & Document;

@Schema({ timestamps: true })
export class Pet {
  @Prop({
    unique: true,
    default: () => RandomNumber.generateRandomNumber(14).toString(),
  })
  _numberId: string;

  @Prop({ type: Types.ObjectId, ref: 'Profile', required: true })
  _profileId: Types.ObjectId;

  @Prop({ type: String, required: true })
  nickname: string;

  @Prop({ type: String, enum: Gender, required: true })
  gender: Gender;

  @Prop({ type: String })
  breed: string;

  @Prop({
    type: {
      type: String,
      default: 'Point',
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location: {
    type: string;
    coordinates: number[];
  };

  @Prop({ type: String, enum: Species, required: true })
  species: Species;

  @Prop({ type: [String], required: true })
  tags: string[];

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ type: [String], required: true })
  generalHealth: string[];

  @Prop({ type: Date, required: true })
  birthdayAt: Date;

  @Prop({ type: [String], required: true })
  vaccinationHistory: string[];

  @Prop({ type: String })
  theme: string;

  @Prop({ type: Boolean, default: true })
  isAlive: boolean;

  @Prop({ type: String })
  notes: string;

  @Prop({ type: String, required: true })
  size: string;

  @Prop({ type: Boolean, default: false })
  isHiddened: Boolean;

  @Prop({ type: String, enum: Status, default: Status.STRAY })
  status: Status;

  @Prop({ type: Boolean, default: false })
  isSpayedOrNeutered: boolean;

  _id?: Types.ObjectId;
}


export const PetSchema = SchemaFactory.createForClass(Pet);

PetSchema.index({ location: '2dsphere' });