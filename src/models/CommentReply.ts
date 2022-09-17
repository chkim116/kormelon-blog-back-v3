import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';

import Comment from './Comment';
import { BaseDateColumn } from './common/BaseDateColumn';
import User from './User';

@Entity('CommentReply')
class CommentReply extends BaseDateColumn {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  value!: string;

  @Column()
  isAnonymous!: boolean;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => User, (user) => user.comments, {
    cascade: true,
  })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  commentId!: string;

  @ManyToOne(() => Comment, (comment) => comment.commentReplies, {
    cascade: true,
  })
  @JoinColumn({ name: 'commentId' })
  comment!: Relation<Comment>;
}

export default CommentReply;
