import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './posts.schema';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostsUsecase } from './usecase/create.usecase';
import { GetPaginationUsecase } from './usecase/getPagination.usecase';
import { CommentPostsUsecase } from './usecase/comment.usecase';
import { ProfileModule } from '../profile/profile.module';
import { UpdatePostsUsecase } from './usecase/update.usecase';
import { LikePostsUsecase } from './usecase/like.usecase';
import { LikeCommentPostsUsecase } from './usecase/likeComment.usecase';
import { UpdateStatusPostsUsecase } from './usecase/updateStatus.usecase';
import { GetByIdUsecase } from './usecase/getById.usecase';

const usecases = [
  CreatePostsUsecase,
  GetPaginationUsecase,
  CommentPostsUsecase,
  UpdatePostsUsecase,
  LikePostsUsecase,
  LikeCommentPostsUsecase,
  UpdateStatusPostsUsecase,
  GetByIdUsecase
];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    ProfileModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, ...usecases],
  exports: [],
})
export class PostsModule {}
