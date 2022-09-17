import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

import Post from './Post';

@Entity('Tag')
class Tag {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  value!: string;

  @ManyToMany(() => Post, (post) => post.tags)
  posts!: Post[];
}

export default Tag;
