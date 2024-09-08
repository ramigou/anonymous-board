import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Check,
  JoinColumn,
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

  @Column()
  recipient_id: number;

  @ManyToOne(() => Author, (author) => author.notifications)
  @JoinColumn({ name: 'recipient_id' })
  recipient: Author;

  @Column()
  keyword_id: number;

  @ManyToOne(() => Keyword, (keyword) => keyword.notifications)
  @JoinColumn({ name: 'keyword_id' })
  keyword: Keyword;

  @Column({
    type: 'enum',
    enum: ['post', 'comment'],
  })
  content_type: 'post' | 'comment';


  @Column({ nullable: true })
  post_id: number | null;

  @ManyToOne(() => Post, (post) => post.notifications, { nullable: true })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column({ nullable: true })
  comment_id: number | null;

  @ManyToOne(() => Comment, (comment) => comment.notifications, {
    nullable: true,
  })
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;

  @Column('text')
  message: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ default: false })
  is_read: boolean;
}
