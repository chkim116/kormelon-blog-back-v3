import { Repository } from 'typeorm';

import { SubCategory } from '@models';

export class SubCategoryService {
  constructor(private subCategoryRepository: Repository<SubCategory>) {}

  /**
   * 하위 카테고리를 생성한다.
   *
   * @param categoryId 상위 카테고리 id
   * @param value 생성할 값
   */
  async create(categoryId: number, value: string) {
    const subCategory = this.subCategoryRepository.create({
      categoryId,
      value,
    });
    await this.subCategoryRepository.save(subCategory);
  }

  /**
   * 하위 카테고리를 업데이트한다.
   *
   * @param subCategoryId 하위 카테고리 id
   * @param value 수정할 값
   */
  async update(subCategoryId: number, value: string) {
    await this.subCategoryRepository.update(subCategoryId, { value });
  }

  /**
   * 하위 카테고리를 제거한다.

  * @param subCategoryId 하위 카테고리 id
   */
  async delete(subCategoryId: number) {
    await this.subCategoryRepository.delete(subCategoryId);
  }
}
