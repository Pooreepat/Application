import { HttpException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { PostsService } from '../posts.service';
import { CreatePostsDto } from '../dto/createPost.dto';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import { IPost } from '../posts.interface';

@Injectable()
export class CreatePostsUsecase {
  constructor(private readonly postService: PostsService) {}

  public async execute(data: CreatePostsDto, user: IUser): Promise<IPost> {
    try {
      const post = await this.postService.createPost({
        title: data.title,
        content: data.content,
        images: data.images,
        isHidden: data.isHidden,
        tags: data.tags,
        location: data.location,
        status: data.status,
        _authorId: new Types.ObjectId(user._id),
      });

      if (!post) {
        throw new HttpException('Cannot create post', 500);
      }

      return post;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
