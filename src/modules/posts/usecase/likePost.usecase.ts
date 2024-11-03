import { HttpException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { PostsService } from '../posts.service';
import { IPost } from '../posts.interface';
import { IUser } from 'src/modules/user/interfaces/user.interface';

@Injectable()
export class LikePostsUsecase {
  constructor(private readonly postService: PostsService) {}

  public async execute(id: string, user: IUser): Promise<IPost> {
    try {
      const post = await this.postService.getPostById(new Types.ObjectId(id));

      if (!post) {
        throw new HttpException('Post not found', 404);
      }

      const alreadyLiked = post.likes.some((like: Types.ObjectId) =>
        like.equals(user._id),
      );

      if (alreadyLiked) {
        const unLikePost = await this.postService.updatePost(
          new Types.ObjectId(id),
          {
            $pull: { likes: new Types.ObjectId(user._id) },
          },
        );
        return unLikePost;
      } else {
        const likePost = await this.postService.updatePost(
          new Types.ObjectId(id),
          {
            $push: { likes: new Types.ObjectId(user._id) },
          },
        );
        return likePost;
      }
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
