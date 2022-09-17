import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import type { Relation } from 'typeorm';

import Category from './Category';
import { BaseDateColumn } from './common/BaseDateColumn';

@Entity('SubCategory')
class SubCategory extends BaseDateColumn {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  value!: string;

  @Column()
  categoryId!: number;

  @ManyToOne(() => Category, (category) => category.subCategories)
  @JoinColumn({ name: 'categoryId' })
  category!: Relation<Category>;
}

export default SubCategory;
