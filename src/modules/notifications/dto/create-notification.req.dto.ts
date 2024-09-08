import { IsDefined, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNotificationReqDto {
  @IsDefined()
  @IsNumber()
  recipient_id: number;

  @IsDefined()
  @IsNumber()
  keyword_id: number;

  @IsDefined()
  // @IsEnum()
  content_type: 'post' | 'comment';

  @IsOptional()
  @IsNumber()
  post_id?: number;

  @IsOptional()
  @IsNumber()
  comment_id?: number;

  @IsDefined()
  @IsString()
  message: string;
}
