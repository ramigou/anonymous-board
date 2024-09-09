import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsString } from 'class-validator';
import { Post } from '../../../entities/post.entity';

export class UpdatePostReqDto extends PartialType(Post) {
  @ApiProperty({ type: String, description: '수정할 게시글 제목' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ type: String, description: '수정할 게시글 본문' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ type: String, description: '게시글 비밀번호' })
  @IsDefined()
  @IsString()
  password: string;
}
