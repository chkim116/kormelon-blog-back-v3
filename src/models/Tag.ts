import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import Post from './Post';

@Entity()
class Tag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  value!: string;

  @ManyToMany(() => Post, (post) => post.tags)
  posts!: Post[];
}

export default Tag;
