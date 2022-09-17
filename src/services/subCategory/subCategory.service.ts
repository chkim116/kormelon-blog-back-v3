import { EntityRepository, getCustomRepository, Repository } from 'typeorm';

import { env } from '@config';
import { SubCategory } from '@models';

export function subCategoryService() {
  return getCustomRepository(SubCategoryService, env.mode);
}

@EntityRepository(SubCategory)
class SubCategoryService extends Repository<SubCategory> {
  /**
   * 하위 카테고리를 조회한다.
   *
   * @returns
   */
  async getSubCategories() {
    const results = await this.createQueryBuilder('subCategory')
      .select(['subCategory.id', 'subCategory.value', 'subCategory.categoryId'])
      .leftJoin('subCategory.posts', 'post')
      .addSelect(['post.id'])
      .getMany();

    return results
      ? results.map((subCategory) => ({
          ...subCategory,
          posts: subCategory.posts.length,
        }))
      : [];
  }

  /**
   * 하위 카테고리를 생성한다.
   *
   * @param categoryId 상위 카테고리 id
   * @param value 생성할 값
   */
  async createSubCategory(categoryId: number, value: string) {
    const subCategory = this.create({
      categoryId,
      value,
    });
    await this.save(subCategory);
  }

  /**
   * 하위 카테고리를 업데이트한다.
   *
   * @param subCategoryId 하위 카테고리 id
   * @param value 수정할 값
   */
  async updateSubCategory(subCategoryId: number, value: string) {
    const exist = await this.findOne(subCategoryId);

    if (!exist) {
      throw new Error('존재하지 않는 카테고리입니다.');
    }

    await this.update(subCategoryId, { value });
  }

  /**
   * 하위 카테고리를 제거한다.

  * @param subCategoryId 하위 카테고리 id
   */
  async deleteSubCategory(subCategoryId: number) {
    if (!isFinite(subCategoryId)) {
      throw new Error('유효한 숫자가 아닙니다.');
    }

    const exist = await this.findOne(subCategoryId);

    if (!exist) {
      throw new Error('존재하지 않는 카테고리입니다.');
    }

    await this.delete(subCategoryId);
  }
}
