import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError, Types } from 'mongoose';
import { EUserRole } from './user.constant';
import UserRegisterDto from './dto/user-register.dto';
import UserLoginDto from '../auth/dto/user-login.dto';
import { IUser } from './user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public async getUserById(userId: Types.ObjectId): Promise<IUser> {
    return this.userModel.findById(userId).lean();
  }

  public async fetchUsers(
    page: number,
    perPage: number,
    filter: Record<string, any>,
  ): Promise<UserDocument[]> {
    return this.userModel
      .find(filter)
      .skip((page - 1) * perPage)
      .limit(perPage);
  }

  public async getUserByUsername(username: string): Promise<UserDocument> {
    return (await this.userModel.findOne({ username }).exec()).toObject();
  }

  public async validateUserCredentials(data: UserLoginDto): Promise<User> {
    try {
      const { username, password } = data;
      const user = await this.userModel
        .findOne({ username })
        .select('+password')
        .exec();
      if (!user) {
        throw new Error('user or password is incorrect');
      }
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        throw new Error('user or password is incorrect');
      }
      delete user.password;

      return user.toObject();
    } catch (e) {
      throw new MongooseError(e);
    }
  }

  public async registerUser(data: UserRegisterDto): Promise<UserDocument> {
    const user = {
      ...data,
      role: [EUserRole.USER],
    };
    return this.userModel.create(user);
  }

  public async createUser(data: Partial<User>): Promise<UserDocument> {
    return this.userModel.create(data);
  }

  public async updateUser(
    userId: string | Types.ObjectId,
    data: Partial<UserDocument>,
  ): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(userId, data, { new: true });
  }

  public async deleteUser(userId: Types.ObjectId): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(userId);
  }

  // public async updateUserByAction(
  //   userId: string,
  //   data: Partial<User>,
  //   action: EUserAction,
  //   note: string,
  // ): Promise<UserDocument> {
  //   return this.userModel.findByIdAndUpdate(
  //     data._id,
  //     {
  //       $set: data,
  //       $push: {
  //         actions: {
  //           userId: userId,
  //           action,
  //           note,
  //         },
  //       },
  //     },
  //     { new: true },
  //   );
  // }
}
