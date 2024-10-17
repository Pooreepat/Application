import { HttpException, Injectable } from '@nestjs/common';
import { HttpRespons } from 'src/interface/respones';
import { Types } from 'mongoose';
import { PostsService } from '../posts.service';

@Injectable()
export class LikePostsUsecase {
  constructor(private readonly postService: PostsService) {}

  public async execute(data: {
    id: Types.ObjectId;
    _profileId: Types.ObjectId;
  }): Promise<HttpRespons> {
    try {
      const post = await this.postService.updatePost(
        new Types.ObjectId(data.id),
        {
          $push: {
            likes: new Types.ObjectId(data._profileId),
          },
        },
      );

      if (!post) {
        throw new HttpException('Cannot like post', 500);
      }

      return {
        message: 'like post success',
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
