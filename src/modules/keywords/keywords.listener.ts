import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from '../notifications/notifications.service';
import { KeywordsService } from './keywords.service';
import { Post } from '../../entities/post.entity';
import { Comment } from '../../entities/comment.entity';

@Injectable()
export class KeywordsListener {
  constructor(
    private readonly keywordsService: KeywordsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @OnEvent('created', { async: true })
  async handleCreatedEvent(event: { post?: Post; comment?: Comment }) {
    const { post, comment } = event;

    const keywords = await this.keywordsService.findAllKeywords();

    for (const keyword of keywords) {
      const regex = new RegExp(keyword.keyword, 'i');

      const isMatched =
        regex.test(post?.title) ||
        regex.test(post?.content) ||
        regex.test(comment?.content);

      if (isMatched) {
        await this.notificationsService.createNotification({
          recipient_id: keyword.author_id,
          keyword_id: keyword.id,
          content_type: post ? 'post' : 'comment',
          post_id: post?.id,
          comment_id: comment?.id,
          message: `The keyword "${keyword.keyword}" was found in content.`,
        });
      }
    }
  }
}
