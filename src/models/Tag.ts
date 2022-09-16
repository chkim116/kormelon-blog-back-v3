import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import Post from './Post';

@Entity('Tag')
class Tag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  value!: string;

  @ManyToMany(() => Post, (post) => post.tags)
  @JoinTable()
  posts!: Post[];
}

export default Tag;
