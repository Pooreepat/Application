import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { EUserRole } from '../constants/user.constant';
import { ProfileDocument, ProfileSchema } from './profile.schema';

export type UserDocument = HydratedDocument<User> & {
  matchPassword(enteredPassword: string): Promise<boolean>;
};

@Schema({
  timestamps: true,
  collection: 'user',
})
export class User {
  @Prop({
    type: String,
    required: true,
    index: true,
    trim: true,
    unique: true,
    minlength: 4,
    maxlength: 100,
  })
  username: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ type: String, required: true, unique: true })
  phone: string;

  @Prop({
    type: [String],
    required: true,
    default: [EUserRole.USER],
    enum: EUserRole,
  })
  role: EUserRole[];

  @Prop({
    type: String,
    required: true,
    select: false,
  })
  password: string;

  @Prop({ type: String, required: true, unique: true })
  identityCard: string;

  @Prop({ type: ProfileSchema })
  profile: ProfileDocument;

  @Prop({ type: Date, required: false, default: new Date() })
  lastLogin?: Date;

  _id?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  const user = this as UserDocument;
  if (!user.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};
