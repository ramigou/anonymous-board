import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Author } from './author.entity';
import { Notification } from './notification.entity';

@Entity('keywords')
export class Keyword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  keyword: string;

  @ManyToOne(() => Author, (author) => author.keywords)
  author: Author;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;

  @OneToMany(() => Notification, (notification) => notification.keyword)
  notifications: Notification[];
}
