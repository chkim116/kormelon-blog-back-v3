import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseDateColumn } from './common/BaseDateColumn';
import User from './User';

@Entity('Notification')
class Notification extends BaseDateColumn {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  postId!: number;

  @Column()
  commentId!: string;

  @Column()
  message!: string;

  @Column({ default: false })
  isRead!: boolean;

  @Column({ nullable: true, default: null })
  userId!: string | null;

  @ManyToOne(() => User, (user) => user.notifications, {
    cascade: true,
  })
  @JoinColumn({ name: 'userId' })
  user!: User;
}

export default Notification;