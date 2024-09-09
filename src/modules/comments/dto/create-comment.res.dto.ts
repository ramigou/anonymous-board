import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
class AuthorDto {
  @ApiProperty({ type: Number, description: '댓글 작성자 번호' })
  @Expose()
  id: number;

  @ApiProperty({ type: String, description: '댓글 작성자 이름(닉네임)' })
  @Expose()
  name: string;
}

@Exclude()
export class CreateCommentResDto {
  @ApiProperty({ type: Number, description: '작성한 댓글 번호' })
  @Expose()
  id: number;

  @ApiProperty({ type: String, description: '작성한 댓글 본문' })
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
}
