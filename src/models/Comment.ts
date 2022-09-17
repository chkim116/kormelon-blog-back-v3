import {
  Column,
  Entity,
  IsNull,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';

import CommentReply from './CommentReply';
import { BaseDateColumn } from './common/BaseDateColumn';
import Post from './Post';
import User from './User';

@Entity('Comment')
class Comment extends BaseDateColumn {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  value!: string;

  @Column({ default: false })
  isAnonymous!: boolean;

  @Column()
  username!: string;

  @Column({ select: false })
  password!: string;

  @Column({ nullable: true, default: true })
  userId!: string | null;

  @ManyToOne(() => User, (user) => user.comments, {
    cascade: true,
  })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  postId!: number;

  @ManyToOne(() => Post, (post) => post.comments, {
    cascade: true,
  })
  @JoinColumn({ name: 'postId' })
  post!: Relation<Post>;

  @OneToMany(() => CommentReply, (commentReplies) => commentReplies.comment, {
    onDelete: 'CASCADE',
  })
  commentReplies!: CommentReply[];
}

export default Comment;
