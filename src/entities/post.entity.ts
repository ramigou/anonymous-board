import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Author } from './author.entity';
import { Comment } from './comment.entity';
import { Notification } from './notification.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  author_id: number;

  @ManyToOne(() => Author, (author) => author.posts, { eager: true })
  @JoinColumn({ name: 'author_id' })
  author: Author;

  @Column()
  password: string;

  @Column()
  salt: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date | null;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Notification, (notification) => notification.post)
  notifications: Notification[];
}
