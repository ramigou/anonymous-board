import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
class AuthorDto {
  @ApiProperty({ type: Number, description: '작성자 번호' })
  @Expose()
  id: number;

  @ApiProperty({ type: String, description: '작성자 이름(닉네임)' })
  @Expose()
  name: string;
}

@Exclude()
export class UpdatePostResDto {
  @ApiProperty({ type: Number, description: '수정한 게시글 번호' })
  @Expose()
  id: number;

  @ApiProperty({ type: String, description: '수정한 게시글 제목' })
  @Expose()
  title: string;

  @ApiProperty({ type: String, description: '수정한 게시글 본문' })
  @Expose()
  content: string;

  @ApiProperty({ type: () => AuthorDto, description: '작성자 정보' })
  @Expose()
  @Type(() => AuthorDto)
  author: AuthorDto;

  @ApiProperty({ type: Date, description: '게시글 작성 날짜' })
  @Expose()
  created_at: Date;

  @ApiProperty({ type: Date, description: '게시글 수정 날짜' })
  @Expose()
  updated_at: Date;
}
