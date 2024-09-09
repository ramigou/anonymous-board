import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsOptional } from 'class-validator';

export class FindCommentsReqDto {
  @ApiProperty({ type: Number, description: '댓글이 달린 게시글 번호' })
  @IsDefined()
  @IsNumber()
  post_id: number;

  @ApiPropertyOptional({
    type: Number,
    description: '한 페이지당 댓글 수',
    default: 5,
  })
  @IsOptional()
  @IsNumber()
  limit?: number = 5;

  @ApiPropertyOptional({ type: Number, description: '페이지', default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number = 1;
}
