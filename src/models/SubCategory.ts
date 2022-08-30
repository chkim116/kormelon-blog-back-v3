import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  RelationId,
} from 'typeorm';

import Category from './Category';
import { BaseDateColumn } from './common/BaseDateColumn';

@Entity('SubCategory')
class SubCategory extends BaseDateColumn {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  value!: string;

  @ManyToOne(() => Category)
  category!: Category;

  @RelationId((category: Category) => category.id)
  @Column()
  categoryId!: number;
}

export default SubCategory;
