import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreatePostsUsecase } from './usecase/create.usecase';
import { GetPaginationUsecase } from './usecase/getPagination.usecase';
import GetPostsPaginationDto from './dto/getPagination.dto';
import { CommentPostsUsecase } from './usecase/comment.usecase';
import { CreatePostsDto } from './dto/create.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../user/user.decorator';
import { ProfileTransformUserPipe } from '../profile/pipe/merchant-transform-user.pipe';
import { IUser } from '../user/user.interface';
import { IProfile } from '../profile/profile.interface';
import { UpdatePostsUsecase } from './usecase/update.usecase';
import { LikePostsUsecase } from './usecase/like.usecase';
import { LikeCommentPostsUsecase } from './usecase/likeComment.usecase';
import { Types } from 'mongoose';
import { CommentPostsDto } from './dto/comment.dto';
import { UpdateStatusPostsUsecase } from './usecase/updateStatus.usecase';
import { EStatusPosts } from './posts.constant';
import { GetByIdUsecase } from './usecase/getById.usecase';

@ApiTags('Posts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(
    private readonly createPostsUsecase: CreatePostsUsecase,
    private readonly getPaginationUsecase: GetPaginationUsecase,
    private readonly commentPostsUsecase: CommentPostsUsecase,
    private readonly updatePostsUsecase: UpdatePostsUsecase,
    private readonly likePostsUsecase: LikePostsUsecase,
    private readonly likeCommentPostsUsecase: LikeCommentPostsUsecase,
    private readonly updateStatusPostsUsecase: UpdateStatusPostsUsecase,
    private readonly getByIdUsecase: GetByIdUsecase,
  ) {}

  @Post()
  public async createPosts(
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
    @Body() body: CreatePostsDto,
  ): Promise<any> {
    return this.createPostsUsecase.execute({
      ...body,
      _profileId: user.profile._id,
    });
  }

  @Get()
  public async getPagination(
    @Query() query: GetPostsPaginationDto,
  ): Promise<any> {
    return this.getPaginationUsecase.execute(query);
  }

  @Put(':id')
  public async updatePosts(
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
    @Param('id') id: string,
    @Body() body,
  ): Promise<any> {
    return this.updatePostsUsecase.execute({
      ...body,
      id,
      _profileId: user.profile._id,
    });
  }

  @Get('like/:id')
  public async likePosts(
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
    @Param('id') id: Types.ObjectId,
  ): Promise<any> {
    return this.likePostsUsecase.execute({
      id: id,
      _profileId: user.profile._id,
    });
  }

  @Post('comment/:id')
  public async createComment(
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
    @Param('id') id: Types.ObjectId,
    @Body() body: CommentPostsDto,
  ): Promise<any> {
    return this.commentPostsUsecase.execute({
      ...body,
      id,
      _profileId: user.profile._id,
    });
  }

  @Get('comment/like/:id')
  public async likeCommentPosts(
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
    @Param('id') id: Types.ObjectId,
  ): Promise<any> {
    return this.likeCommentPostsUsecase.execute({
      id: new Types.ObjectId(id),
      _profileId: user.profile._id,
    });
  }

  @Put('archive/:id')
  public async updateStatus(
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
    @Param('id') id: Types.ObjectId,
  ): Promise<any> {
    return this.updateStatusPostsUsecase.execute({
      id,
      _profileId: user.profile._id,
    });
  }

  @Get(':id')
  public async getPost(@Param('id') id: Types.ObjectId): Promise<any> {
    return this.getByIdUsecase.execute({
      id,
    });
  }
}
