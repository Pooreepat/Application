import { HttpException, Injectable } from '@nestjs/common';
import { HttpRespons } from 'src/interface/respones';
import { Types } from 'mongoose';
import { PostsService } from '../posts.service';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import { IPost } from '../posts.interface';

@Injectable()
export class LikeCommentUsecase {
  constructor(private readonly postService: PostsService) {}

  public async execute(commentId:string ,postId: string, user: IUser): Promise<IPost> {
    try {
      const post = await this.postService.updatePost(
        new Types.ObjectId(postId),
        {
          $set: {
            'comments.$[elem].likes': new Types.ObjectId(user._id),
          },
        },
        {
          arrayFilters: [{ 'elem._id': new Types.ObjectId(commentId) }],
        }
      );

      if (!post) {
        throw new HttpException('Cannot like comment', 500);
      }

      return post;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
