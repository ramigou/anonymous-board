import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Check,
} from 'typeorm';
import { Author } from './author.entity';
import { Keyword } from './keyword.entity';
import { Post } from './post.entity';
import { Comment } from './comment.entity';

@Entity('notifications')
@Check(
  `(content_type = 'post' AND post_id IS NOT NULL AND comment_id IS NULL) OR (content_type = 'comment' AND comment_id IS NOT NULL AND post_id IS NULL)`,
)
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Author, (author) => author.notifications)
  recipient: Author;

  @ManyToOne(() => Keyword, (keyword) => keyword.notifications)
  keyword: Keyword;

  @Column({
    type: 'enum',
    enum: ['post', 'comment'],
  })
  content_type: 'post' | 'comment';

  @ManyToOne(() => Post, (post) => post.notifications, { nullable: true })
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.notifications, {
    nullable: true,
  })
  comment: Comment;

  @Column('text')
  message: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ default: false })
  is_read: boolean;
}
