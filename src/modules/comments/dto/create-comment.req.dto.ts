import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';
import { Author } from 'src/entities/author.entity';
import { Post } from 'src/entities/post.entity';

export class CreateCommentReqDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  author_name: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  content: string;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  post_id: number;

  @ApiPropertyOptional()
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
