import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindPostsReqDto {
  @ApiPropertyOptional({ type: String, description: '검색할 게시글 제목' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    type: String,
    description: '검색할 작성자 이름(닉네임)',
  })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({ type: Number, description: '페이지', default: 1 })
  @IsOptional()
  @IsNumber()
  page: number = 1;

  @ApiPropertyOptional({
    type: Number,
    description: '한 페이지당 게시글 수',
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  limit: number = 10;
}
