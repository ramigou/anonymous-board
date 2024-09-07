import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
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

  @ManyToOne(() => Author, (author) => author.comments)
  author: Author;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.childComments, {
    nullable: true,
  })
  parent_comment: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent_comment)
  childComments: Comment[];

  @OneToMany(() => Notification, (notification) => notification.comment)
  notifications: Notification[];
}
