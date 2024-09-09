import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
class AuthorDto {
  @ApiProperty({ type: Number, description: '댓글 작성자 번호' })
  @Expose()
  id: number;

  @ApiProperty({ type: Number, description: '댓글 작성자 이름(닉네임)' })
  @Expose()
  name: string;
}

@Exclude()
class CommentDto {
  @ApiProperty({ type: Number, description: '댓글 번호' })
  @Expose()
  id: number;

  @ApiProperty({ type: String, description: '댓글 본문' })
  @Expose()
  content: string;

  @ApiProperty({ type: Number, description: '댓글이 달린 게시글 번호' })
  @Expose()
  post_id: number;

  @ApiProperty({ type: Number, description: '대댓글이 달린 댓글 번호' })
  @Expose()
  parent_comment_id: number | null;

  @ApiProperty({ type: () => AuthorDto, description: '댓글 작성자 정보' })
  @Expose()
  @Type(() => AuthorDto)
  author: AuthorDto;

  @ApiProperty({ type: Date, description: '댓글 작성 날짜' })
  @Expose()
  created_at: Date;

  @ApiProperty({ type: () => [CommentDto], description: '대댓글 목록' })
  @Expose()
  @Type(() => CommentDto)
  childComments: CommentDto[];
}

export class FindCommentsResDto {
  @ApiProperty({ type: Number, description: '특정 게시글에 달린 총 댓글 수' })
  total: number;

  @ApiProperty({
    type: () => CommentDto,
    description: '특정 게시글에 달린 댓글 목록',
  })
  @Type(() => CommentDto)
  comments: CommentDto[];
}
