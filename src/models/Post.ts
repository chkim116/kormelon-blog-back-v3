import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Category from './Category';
import Comment from './Comment';
import { BaseDateColumn } from './common/BaseDateColumn';
import SubCategory from './SubCategory';
import User from './User';

@Entity('Post')
class Post extends BaseDateColumn {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  thumbnail!: string;

  @Column()
  title!: string;

  @Column({ type: 'longtext' })
  content!: string;

  @Column({ default: 0 })
  view!: number;

  @Column({ default: false })
  isPrivate!: boolean;

  // relations
  @Column()
  categoryId!: number;

  @Column()
  subCategoryId!: number;

  @Column()
  userId!: string;

  @ManyToOne(() => Category, (category) => category.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category!: number;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subCategoryId' })
  subCategory!: number;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @OneToMany(() => Comment, (comment) => comment.postId)
  comments!: Comment[];
}

export default Post;
