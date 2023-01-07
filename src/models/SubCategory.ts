import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';

import Category from './Category';
import { BaseDateColumn } from './common/BaseDateColumn';
import Post from './Post';

@Entity()
class SubCategory extends BaseDateColumn {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  value!: string;

  @Column()
  categoryId!: number;

  @ManyToOne(() => Category, (category) => category.subCategories, {
    cascade: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category!: Relation<Category>;

  @OneToMany(() => Post, (post) => post.subCategory, {
    onDelete: 'CASCADE',
  })
  posts!: Post[];
}

export default SubCategory;
