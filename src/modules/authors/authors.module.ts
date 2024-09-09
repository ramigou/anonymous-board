import { Module } from '@nestjs/common';
import { AuthorsRepository } from './authors.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from 'src/entities/author.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Author])],
  providers: [AuthorsRepository],
  exports: [AuthorsRepository],
})
export class AuthorsModule {}
