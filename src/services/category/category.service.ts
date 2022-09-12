import { EntityRepository, getCustomRepository, Repository } from 'typeorm';

import { env } from '@config';
import { Category } from '@models';

export function categoryService() {
  return getCustomRepository(CategoryService, env.mode);
}

// TODO: 관리자만 가능하도록 middleware 추가
@EntityRepository(Category)
class CategoryService extends Repository<Category> {
  /**
   * 카테고리(상위)를 생성한다.
   * @param value 생성할 값
   */
  async createCategory(value: string) {
    if (value !== '') {
      throw new Error('값을 입력해 주세요.');
    }

    const category = this.create({ value });
    await this.save(category);
  }

  /**
   * 카테고리(상위)를 업데이트 한다.
   * @param categoryId 카테고리 id
   * @param value 수정될 값
   */
  async updateCategory(categoryId: number, value: string) {
    await this.update(categoryId, { value });
  }

  /**
   * 카테고리(상위)를 제거한다.
   *
   * 하위 카테고리가 없어야 제거 가능하다.
   *
   * @param categoryId 카테고리 id
   */
  async deleteCategory(categoryId: number) {
    const category = await this.findOne({
      where: {
        id: categoryId,
      },
      relations: ['subCategories'],
    });

    if (!category?.subCategories.length) {
      throw new Error('하위 카테고리를 모두 삭제해 주세요.');
    }

    await this.delete(categoryId);
  }
}
