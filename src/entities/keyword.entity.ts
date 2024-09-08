import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Author } from './author.entity';
import { Notification } from './notification.entity';

@Entity('keywords')
export class Keyword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  keyword: string;

  @Column()
  author_id: number;

  @ManyToOne(() => Author, (author) => author.keywords)
  @JoinColumn({ name: 'author_id' })
  author: Author;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date;

  @OneToMany(() => Notification, (notification) => notification.keyword)
  notifications: Notification[];
}
