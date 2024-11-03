import { HttpException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { PostsService } from '../posts.service';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import { IPost } from '../posts.interface';

@Injectable()
export class ReceiverPostsUsecase {
  constructor(private readonly postService: PostsService) {}

  public async execute(id: string, user: IUser): Promise<IPost> {
    try {
      const post = await this.postService.getPostById(new Types.ObjectId(id));

      if (!post) {
        throw new HttpException('Not found post', 404);
      }

      if (post._authorId.equals(user._id)) {
        throw new HttpException('Cannot receive post', 500);
      }

      if (post._receiverId) {
        throw new HttpException('Post already received', 500);
      }

      const updatePost = await this.postService.updatePost(
        new Types.ObjectId(id),
        {
          $set: {
            _receiverId: new Types.ObjectId(user._id),
          },
        },
      );

      if (!updatePost) {
        throw new HttpException('Cannot create post', 500);
      }

      return updatePost;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
