import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { Author } from './author.entity';
import { Post } from './post.entity';
import { Notification } from './notification.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column()
  author_id: number;

  @ManyToOne(() => Author, (author) => author.comments)
  @JoinColumn({ name: 'author_id' })
  author: Author;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date | null;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date | null;

  @Column({ nullable: true })
  post_id: number | null;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column({ nullable: true })
  parent_comment_id: number | null;

  @ManyToOne(() => Comment, (comment) => comment.childComments, {
    nullable: true,
  })
  @JoinColumn({ name: 'parent_comment_id' })
  parentComment: Comment;

  @OneToMany(() => Comment, (comment) => comment.parentComment)
  childComments: Comment[];

  @OneToMany(() => Notification, (notification) => notification.comment)
  notifications: Notification[];
}
