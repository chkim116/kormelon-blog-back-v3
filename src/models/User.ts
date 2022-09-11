import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import Comment from './Comment';
import { BaseDateColumn } from './common/BaseDateColumn';
import Post from './Post';

type UserRoleType = ['admin', 'member'];

@Entity('User')
class User extends BaseDateColumn {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  profileImage!: string;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'member'],
    default: 'member',
  })
  role!: UserRoleType;

  @OneToMany(() => Post, (post) => post.userId, {
    onDelete: 'CASCADE',
  })
  posts!: Post[];

  @OneToMany(() => Comment, (comment) => comment.userId)
  comments!: Comment[];
}

export default User;
