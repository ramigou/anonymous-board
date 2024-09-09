import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';
import { Author } from 'src/entities/author.entity';
import { Post } from 'src/entities/post.entity';

export class CreateCommentReqDto {
  @ApiProperty({ type: String, description: '댓글 작성자 이름(닉네임)' })
  @IsDefined()
  @IsString()
  author_name: string;

  @ApiProperty({ type: String, description: '댓글 본문' })
  @IsDefined()
  @IsString()
  content: string;

  @ApiProperty({ type: Number, description: '게시글 번호' })
  @IsDefined()
  @IsNumber()
  post_id: number;

  @ApiPropertyOptional({ type: Number, description: '부모 댓글' })
  @IsOptional()
  @IsNumber()
  parent_comment_id?: number;
}

export class CreateCommentDtoForDb extends CreateCommentReqDto {
  @IsDefined()
  author: Author;

  @IsDefined()
  post: Post;
}
