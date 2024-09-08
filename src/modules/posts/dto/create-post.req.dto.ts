import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';
import { Author } from 'src/entities/author.entity';

export class CreatePostReqDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  title: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  content: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  author_name: string;

  @ApiProperty()
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
