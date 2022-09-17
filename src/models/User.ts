import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import Comment from './Comment';
import { BaseDateColumn } from './common/BaseDateColumn';
import Post from './Post';

export enum UserRoleEnum {
  ADMIN = 'admin',
  MEMBER = 'member',
}
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
  role!: UserRoleEnum;

  @OneToMany(() => Post, (post) => post.user, {
    onDelete: 'CASCADE',
  })
  posts!: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments!: Comment[];
}

export default User;
