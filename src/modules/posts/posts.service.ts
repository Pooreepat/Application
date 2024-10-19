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
      { $unwind: { path: '$comments', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'profiles',
          localField: 'comments._profileId',
          foreignField: '_id',
          as: 'comments.profile',
        },
      },
      {
        $unwind: {
          path: '$comments.profile',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          content: { $first: '$content' },
          profile: { $first: '$profile' },
          receiver: { $first: '$receiver' },
          images: { $first: '$images' },
          likes: { $first: '$likes' },
          isHidden: { $first: '$isHidden' },
          tags: { $first: '$tags' },
          location: { $first: '$location' },
          status: { $first: '$status' },
          createdAt: { $first: '$createdAt' },
          comments: { $push: '$comments' },
        },
      },
      {
        $sort: { createdAt: -1 },
      }
    ];

    const posts = await this.postModel.aggregate(pipeline).exec();

    const total = await this.postModel.countDocuments(filterQuery);

    return [posts, total];
  }

  public async createPost(data: Partial<Post>): Promise<PostDocument> {
    return this.postModel.create(data);
  }

  public async getPostById(id: Types.ObjectId): Promise<PostDocument> {
    const post = await this.postModel.aggregate([
      { $match: { _id: id } },
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
      { $unwind: { path: '$comments', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'profiles',
          localField: 'comments._profileId',
          foreignField: '_id',
          as: 'comments.profile',
        },
      },
      {
        $unwind: {
          path: '$comments.profile',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          content: { $first: '$content' },
          profile: { $first: '$profile' },
          receiver: { $first: '$receiver' },
          images: { $first: '$images' },
          likes: { $first: '$likes' },
          isHidden: { $first: '$isHidden' },
          tags: { $first: '$tags' },
          location: { $first: '$location' },
          status: { $first: '$status' },
          createdAt: { $first: '$createdAt' },
          comments: { $push: '$comments' },
        },
      },
      { $limit: 1 },
    ]);
    return post[0];
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
