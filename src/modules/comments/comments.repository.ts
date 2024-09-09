import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateCommentDtoForDb } from './dto/create-comment.req.dto';
import { FindCommentsReqDto } from './dto/find-commnets.req.dto';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDtoForDb): Promise<Comment> {
    const { author, content, post, parent_comment_id } = createCommentDto;
    const comment = this.commentsRepository.create({
      content,
      author,
      post,
      parent_comment_id,
    });

    return await this.commentsRepository.save(comment);
  }

  async findAll(filter: FindCommentsReqDto): Promise<Comment[]> {
    const { post_id, limit = 5, page = 1 } = filter;

    return await this.commentsRepository.find({
      where: { post_id, parent_comment_id: IsNull() },
      relations: ['author', 'childComments', 'childComments.author'],
      order: { id: 'DESC', childComments: { id: 'DESC' } },
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async countAll(postId: number): Promise<number> {
    return await this.commentsRepository.count({ where: { post_id: postId } });
  }
}
