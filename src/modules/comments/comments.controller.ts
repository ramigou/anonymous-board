import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentReqDto } from './dto/create-comment.req.dto';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FindCommentsReqDto } from './dto/find-commnets.req.dto';
import { plainToInstance } from 'class-transformer';
import { CreateCommentResDto } from './dto/create-comment.res.dto';
import { FindCommentsResDto } from './dto/find-comment.res.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOkResponse({
    type: () => CreateCommentResDto,
    description: '댓글 작성 결과',
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 게시글에 댓글을 작성하려고 함',
  })
  @Post()
  async create(
    @Body() body: CreateCommentReqDto,
  ): Promise<CreateCommentResDto> {
    const newComment = await this.commentsService.createComment(body);
    return plainToInstance(CreateCommentResDto, newComment);
  }

  @ApiOkResponse({
    type: () => FindCommentsResDto,
    description: '특정 게시글에 달린 댓글 목록',
  })
  @Get()
  async findAllComments(
    @Query() query: FindCommentsReqDto,
  ): Promise<FindCommentsResDto> {
    const commentsAndTotal = await this.commentsService.findAllComments(query);
    return plainToInstance(FindCommentsResDto, commentsAndTotal);
  }
}
