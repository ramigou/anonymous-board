import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';
import { Author } from '../../../entities/author.entity';

export class CreatePostReqDto {
  @ApiProperty({ description: '게시글 제목', type: String })
  @IsDefined()
  @IsString()
  title: string;

  @ApiProperty({ description: '게시글 본문', type: String })
  @IsDefined()
  @IsString()
  content: string;

  @ApiProperty({ description: '작성자 이름(닉네임)', type: String })
  @IsDefined()
  @IsString()
  author_name: string;

  @ApiProperty({ description: '게시글 비밀번호', type: String })
  @IsDefined()
  @IsString()
  password: string;
}

export class CreatePostReqDtoForDb extends CreatePostReqDto {
  @IsDefined()
  @IsString()
  salt: string;

  @IsDefined()
  author: Author;
}
