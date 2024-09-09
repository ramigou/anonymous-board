import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
class AuthorDto {
  @ApiProperty({ type: Number, description: '작성자 번호' })
  @Expose()
  id: number;

  @ApiProperty({ type: Number, description: '작성자 이름(닉네임)' })
  @Expose()
  name: string;
}

@Exclude()
class PostDto {
  @ApiProperty({ type: Number, description: '게시글 번호' })
  @Expose()
  id: number;

  @ApiProperty({ type: String, description: '게시글 제목' })
  @Expose()
  title: string;

  @ApiProperty({ type: String, description: '게시글 본문' })
  @Expose()
  content: string;

  @ApiProperty({ type: Date, description: '게시글 작성 날짜' })
  @Expose()
  created_at: Date;

  @ApiProperty({ type: Date, description: '게시글을 마지막으로 수정한 날짜' })
  @Expose()
  updated_at: Date | null;

  @ApiProperty({ type: () => AuthorDto, description: '작성자 정보' })
  @Expose()
  @Type(() => AuthorDto)
  author: AuthorDto;
}

export class FindPostsResDto {
  @ApiProperty({ type: Number, description: '검색 결과 게시글 수' })
  total: number;

  @ApiProperty({ type: () => [PostDto], description: '검색 결과 게시글 목록' })
  @Type(() => PostDto)
  posts: PostDto[];
}
