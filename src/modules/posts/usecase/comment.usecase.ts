import { HttpException, Injectable } from '@nestjs/common';
import { HttpRespons } from 'src/interface/respones';
import { Types } from 'mongoose';
import { PostsService } from '../posts.service';
import { CommentPostsDto } from '../dto/comment.dto';

@Injectable()
export class CommentPostsUsecase {
  constructor(private readonly postService: PostsService) {}

  public async execute(
    data: CommentPostsDto & {
      id: Types.ObjectId;
      _profileId: Types.ObjectId;
    },
  ): Promise<HttpRespons> {
    try {
      const post = await this.postService.updatePost(
        new Types.ObjectId(data.id),
        {
          $push: {
            comments: {
              _profileId: new Types.ObjectId(data._profileId),
              text: data.text,
            },
          },
        },
      );

      if (!post) {
        throw new HttpException('Cannot create comment', 500);
      }

      return {
        message: 'Create comment success',
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
