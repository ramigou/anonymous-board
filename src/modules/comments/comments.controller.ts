import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentReqDto } from './dto/create-comment.req.dto';
import { ApiTags } from '@nestjs/swagger';
import { FindCommentsReqDto } from './dto/find-commnets.req.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() body: CreateCommentReqDto) {
    return this.commentsService.createComment(body);
  }

  @Get()
  findAllComments(@Query() query: FindCommentsReqDto) {
    return this.commentsService.findAllComments(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }
}
