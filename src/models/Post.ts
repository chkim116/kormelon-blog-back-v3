import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Category from './Category';
import Comment from './Comment';
import { BaseDateColumn } from './common/BaseDateColumn';
import SubCategory from './SubCategory';
import Tag from './Tag';
import User from './User';

@Entity()
class Post extends BaseDateColumn {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  thumbnail!: string;

  @Column()
  title!: string;

  @Column()
  preview!: string;

  @Column()
  readTime!: number;

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

  @Column({ default: 0 })
  like!: number;

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

  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[];

  @ManyToMany(() => Tag, (tag) => tag.posts, {
    cascade: true,
  })
  @JoinTable()
  tags!: Tag[];
}

export default Post;
