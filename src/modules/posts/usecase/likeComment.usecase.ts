import { HttpException, Injectable } from '@nestjs/common';
import { HttpRespons } from 'src/interface/respones';
import { Types } from 'mongoose';
import { PostsService } from '../posts.service';
import { CommentPostsDto } from '../dto/comment.dto';

@Injectable()
export class LikeCommentPostsUsecase {
  constructor(private readonly postService: PostsService) {}

  public async execute(data: {
    id: Types.ObjectId;
    _profileId: Types.ObjectId;
  }): Promise<HttpRespons> {
    try {
      const post = await this.postService.updatePost(
        new Types.ObjectId(data.id),
        {
          $addToSet: { likes: new Types.ObjectId(data._profileId) },
        },
      );

      if (!post) {
        throw new HttpException('Cannot like comment', 500);
      }

      return {
        message: 'like comment success',
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
