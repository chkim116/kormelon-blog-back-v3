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
  async getSubCategories(categoryId: number) {
    const results = await this.createQueryBuilder('subCategory')
      .where({ categoryId: categoryId })
      .select(['subCategory.id', 'subCategory.value', 'subCategory.categoryId'])
      .leftJoin('subCategory.category', 'category')
      .addSelect(['category.id', 'category.value'])
      .leftJoin('subCategory.posts', 'post')
      .where('post.isPrivate = :isPrivate', { isPrivate: false })
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
    await this.exist(subCategoryId);
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

    const subCategory = await this.exist(subCategoryId);

    if (subCategory.posts.length) {
      throw new Error('해당 카테고리로 작성된 게시글을 삭제해 주세요.');
    }

    await this.delete(subCategoryId);
  }

  /**
   * 하위 카테고리가 있는지 없는지 확인한다.
   *
   * @param subCategoryId
   * @returns
   */
  async exist(subCategoryId: number): Promise<SubCategory> {
    const exist = await this.createQueryBuilder('subCategory')
      .where('subCategory.id = :id', { id: subCategoryId })
      .select(['subCategory.id'])
      .leftJoin('subCategory.posts', 'post')
      .addSelect(['post.id'])
      .getOne();

    if (!exist) {
      throw new Error('존재하지 않는 하위 카테고리입니다.');
    }

    return exist;
  }
}
