import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './posts.schema';
import { Model, Types, UpdateQuery } from 'mongoose';
import { IPost } from './posts.interface';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  public async getPagination(
    filterQuery: any,
    page: number,
    perPage: number,
  ): Promise<[PostDocument[], number]> {
    const pipeline: any[] = [
      { $match: filterQuery },
      {
        $lookup: {
          from: 'user',
          localField: '_authorId',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $lookup: {
          from: 'user',
          localField: '_receiverId',
          foreignField: '_id',
          as: 'receiver',
        },
      },
      { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$receiver', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$comments', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'user',
          localField: 'comments._authorId',
          foreignField: '_id',
          as: 'comments.author',
        },
      },
      {
        $unwind: {
          path: '$comments.author',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          _numberId: { $first: '$_numberId' },
          author: { $first: '$author' },
          receiver: { $first: '$receiver' },
          title: { $first: '$title' },
          content: { $first: '$content' },
          images: { $first: '$images' },
          likes: { $first: '$likes' },
          comments: { $push: '$comments' },
          isHidden: { $first: '$isHidden' },
          tags: { $first: '$tags' },
          location: { $first: '$location' },
          status: { $first: '$status' },
          createdAt: { $first: '$createdAt' },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: (page - 1) * perPage,
      },
      {
        $limit: perPage,
      },
    ];

    const posts = await this.postModel.aggregate(pipeline).exec();
    const total = await this.postModel.countDocuments(filterQuery);

    return [posts, total];
  }

  public async createPost(data: Partial<IPost>): Promise<PostDocument> {
    return this.postModel.create(data);
  }

  public async getPostById(id: Types.ObjectId): Promise<PostDocument> {
    const post = await this.postModel.aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: 'user',
          localField: '_authorId',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $lookup: {
          from: 'user',
          localField: '_receiverId',
          foreignField: '_id',
          as: 'receiver',
        },
      },
      { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$receiver', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$comments', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'user',
          localField: 'comments._authorId',
          foreignField: '_id',
          as: 'comments.author',
        },
      },
      {
        $unwind: {
          path: '$comments.author',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          _numberId: { $first: '$_numberId' },
          _authorId: { $first: '$_authorId' },
          author: { $first: '$author' },
          receiver: { $first: '$receiver' },
          title: { $first: '$title' },
          content: { $first: '$content' },
          images: { $first: '$images' },
          likes: { $first: '$likes' },
          comments: { $push: '$comments' },
          isHidden: { $first: '$isHidden' },
          tags: { $first: '$tags' },
          location: { $first: '$location' },
          status: { $first: '$status' },
          createdAt: { $first: '$createdAt' },
        },
      },
      { $limit: 1 },
    ]);
    return post[0];
  }

  public async updatePost(
    id: Types.ObjectId,
    data: UpdateQuery<Post>,
    options: Record<string, any> = {},
  ): Promise<PostDocument> {
    return this.postModel.findByIdAndUpdate(id, data, {
      new: true,
      ...options,
    });
  }

  public async deletePost(id: string): Promise<PostDocument> {
    return this.postModel.findByIdAndDelete(id);
  }
}
