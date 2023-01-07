import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';

import { BaseDateColumn } from './common/BaseDateColumn';
import User from './User';

@Entity()
class Notification extends BaseDateColumn {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  postId!: number;

  @Column()
  commentId!: string;

  @Column({ default: false })
  isRead!: boolean;

  @Column({ nullable: true, default: null })
  userId!: string | null;

  @Column()
  message!: string;

  @ManyToOne(() => User, (user) => user.notifications, {
    cascade: true,
  })
  @JoinColumn({ name: 'userId' })
  user!: Relation<User>;
}

export default Notification;
