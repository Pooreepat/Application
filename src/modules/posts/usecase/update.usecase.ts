import { HttpException, Injectable } from '@nestjs/common';
import { HttpRespons } from 'src/interface/respones';
import { Types } from 'mongoose';
import { PostsService } from '../posts.service';
import UpdatePostsDto from '../dto/update.dto';

@Injectable()
export class UpdatePostsUsecase {
  constructor(private readonly postService: PostsService) {}

  public async execute(
    data: UpdatePostsDto & {
      id: Types.ObjectId;
      _profileId: Types.ObjectId;
    },
  ): Promise<HttpRespons> {
    try {
      const post = await this.postService.updatePost(
        new Types.ObjectId(data.id),
        {
          $set: {
            content: data.content,
            images: data.images,
            isHidden: data.isHidden,
            tags: data.tags,
            location: data.location,
            status: data.status,
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
