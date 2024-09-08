import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { AuthorsRepository } from './authors.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from 'src/entities/author.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Author])],
  controllers: [AuthorsController],
  providers: [AuthorsService, AuthorsRepository],
  exports: [AuthorsRepository],
})
export class AuthorsModule {}
