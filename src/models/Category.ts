import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { BaseDateColumn } from './common/BaseDateColumn';
import SubCategory from './SubCategory';

@Entity('Category')
class Category extends BaseDateColumn {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  value!: string;

  @OneToMany(() => SubCategory, (SubCategory) => SubCategory.categoryId, {
    cascade: true,
  })
  subCategories!: SubCategory[];
}

export default Category;
