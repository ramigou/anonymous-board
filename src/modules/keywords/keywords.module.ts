import { Module } from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { KeywordsController } from './keywords.controller';
import { Keyword } from 'src/entities/keyword.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeywordsRepository } from './keywords.repository';
import { KeywordsListener } from './keywords.listener';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Keyword]), NotificationsModule],
  controllers: [KeywordsController],
  providers: [KeywordsService, KeywordsRepository, KeywordsListener],
  exports: [KeywordsService],
})
export class KeywordsModule {}
