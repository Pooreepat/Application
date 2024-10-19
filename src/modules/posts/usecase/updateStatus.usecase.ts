import { HttpException, Injectable } from '@nestjs/common';
import { HttpRespons } from 'src/interface/respones';
import { Types } from 'mongoose';
import { PostsService } from '../posts.service';
import UpdatePostsDto from '../dto/update.dto';
import { EStatusPosts } from '../posts.constant';

@Injectable()
export class UpdateStatusPostsUsecase {
  constructor(private readonly postService: PostsService) {}

  public async execute(data: {
    id: Types.ObjectId;
    _profileId: Types.ObjectId;
  }): Promise<HttpRespons> {
    try {
      const post = await this.postService.updatePost(
        new Types.ObjectId(data.id),
        {
          $set: {
            _receiverId: new Types.ObjectId(data._profileId),
          },
        },
      );

      if (!post) {
        throw new HttpException('Cannot create post', 500);
      }

      return {
        message: 'Create post success',
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
