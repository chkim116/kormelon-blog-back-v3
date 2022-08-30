import { Repository } from 'typeorm';

import { Category } from '@models';

// TODO: 관리자만 가능하도록 middleware 추가
export class CategoryService {
  constructor(private categoryRepository: Repository<Category>) {}

  /**
   * 카테고리(상위)를 생성한다.
   * @param value 생성할 값
   */
  async create(value: string) {
    if (value !== '') {
      throw new Error('값을 입력해 주세요.');
    }

    const category = this.categoryRepository.create({ value });
    await this.categoryRepository.save(category);
  }

  /**
   * 카테고리(상위)를 업데이트 한다.
   * @param categoryId 카테고리 id
   * @param value 수정될 값
   */
  async update(categoryId: number, value: string) {
    await this.categoryRepository.update(categoryId, { value });
  }

  /**
   * 카테고리(상위)를 제거한다.
   *
   * 하위 카테고리가 없어야 제거 가능하다.
   *
   * @param categoryId 카테고리 id
   */
  async delete(categoryId: number) {
    const category = await this.categoryRepository.findOne({
      where: {
        id: categoryId,
      },
      relations: ['subCategories'],
    });

    if (!category?.subCategories.length) {
      throw new Error('하위 카테고리를 모두 삭제해 주세요.');
    }

    await this.categoryRepository.delete(categoryId);
  }
}
