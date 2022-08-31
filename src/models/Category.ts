import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BaseDateColumn } from './common/BaseDateColumn';
import Post from './Post';
import SubCategory from './SubCategory';

@Entity('Category')
class Category extends BaseDateColumn {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  value!: string;

  @OneToMany(() => SubCategory, (SubCategory) => SubCategory.categoryId, {
    onDelete: 'CASCADE',
  })
  subCategories!: SubCategory[];

  @OneToMany(() => Post, (post) => post.category, {
    onDelete: 'CASCADE',
  })
  posts!: Post[];
}

export default Category;
