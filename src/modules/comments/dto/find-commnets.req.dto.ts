import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsOptional } from 'class-validator';

export class FindCommentsReqDto {
  @ApiProperty()
  @IsDefined()
  @IsNumber()
  post_id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  limit?: number = 5;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  page?: number = 1;
}
