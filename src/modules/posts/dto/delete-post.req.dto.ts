import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class DeletePostReqDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  password: string;
}
