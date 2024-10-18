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
      // Find the post by its ID
      const post = await this.postService.getPostById(
        new Types.ObjectId(data.id),
      );

      if (!post) {
        throw new HttpException('Post not found', 404);
      }

      // Check if the _profileId already exists in the likes array
      const alreadyLiked = post.likes.some((like: Types.ObjectId) =>
        like.equals(data._profileId),
      );

      if (alreadyLiked) {
        // If already liked, remove the _profileId from the likes array
        await this.postService.updatePost(new Types.ObjectId(data.id), {
          $pull: { likes: new Types.ObjectId(data._profileId) },
        });
        return {
          message: 'Unlike post success',
        };
      } else {
        // If not liked yet, add the _profileId to the likes array
        await this.postService.updatePost(new Types.ObjectId(data.id), {
          $push: { likes: new Types.ObjectId(data._profileId) },
        });
        return {
          message: 'Like post success',
        };
      }
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
