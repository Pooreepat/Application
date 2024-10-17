import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './posts.schema';
import { Model, Types, UpdateQuery } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  public async getPagination(filterQuery: any, skip: number, perPage: number) {
    const pipeline: any[] = [
      { $match: filterQuery },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: perPage },
      {
        $lookup: {
          from: 'profiles',
          localField: '_profileId',
          foreignField: '_id',
          as: 'profile',
        },
      },
      {
        $lookup: {
          from: 'profiles',
          localField: '_receiverId',
          foreignField: '_id',
          as: 'receiver',
        },
      },
      { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$receiver', preserveNullAndEmptyArrays: true } },
    ];

    const posts = await this.postModel.aggregate(pipeline).exec();

    const total = await this.postModel.countDocuments(filterQuery);

    return [posts, total];
  }

  public async createPost(data: Partial<Post>): Promise<PostDocument> {
    return this.postModel.create(data);
  }

  public async getPostById(id: string): Promise<PostDocument> {
    return this.postModel.findById(id).lean();
  }

  public async getPosts(): Promise<PostDocument[]> {
    return this.postModel.find().exec();
  }

  public async updatePost(
    id: Types.ObjectId,
    data: UpdateQuery<Post>,
  ): Promise<PostDocument> {
    return this.postModel.findByIdAndUpdate(id, data, { new: true });
  }

  public async deletePost(id: string): Promise<PostDocument> {
    return this.postModel.findByIdAndDelete(id);
  }
}
