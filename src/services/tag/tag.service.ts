import { EntityRepository, getCustomRepository, In, Repository } from 'typeorm';

import { env } from '@config';
import { Tag } from '@models';

import { TagCreateParamsEntity } from './tag.dto';

export function tagService() {
  return getCustomRepository(TagService, env.mode);
}

@EntityRepository(Tag)
class TagService extends Repository<Tag> {
  /**
   * 태그 전체 조회
   *
   * 태그의 id를 인자로 넘기면 필터하여 조회한다.
   *
   * @returns
   */
  async getTags(ids?: number[]) {
    let tags;

    if (ids?.length) {
      tags = await this.createQueryBuilder('tags')
        .where(In(ids))
        .select(['tags.id', 'tags.value'])
        .leftJoin('tags.posts', 'post')
        .addSelect(['post.id'])
        .getMany();
    } else {
      tags = await this.createQueryBuilder('tags')
        .select(['tags.id', 'tags.value'])
        .leftJoin('tags.posts', 'post')
        .addSelect(['post.id'])
        .getMany();
    }

    const total = await this.count();

    return {
      tags,
      total,
    };
  }

  /**
   * 태그 상세 조회
   *
   * @param tagId
   * @returns
   */
  async getTagById(tagId: number) {
    await this.exist(tagId);

    return await this.createQueryBuilder('tags')
      .select(['tags.id', 'tags.value'])
      .leftJoin('tags.posts', 'post')
      .addSelect(['post.id'])
      .getOne();
  }

  /**
   * 태그 생성
   *
   * @param params
   */
  async createTags({ values }: TagCreateParamsEntity) {
    const exist = await this.findOne({ where: { value: In(values) } });

    if (exist) {
      throw new Error('이미 존재하는 태그입니다.');
    }

    const promises = () =>
      values.map(async (value) => {
        const tag = new Tag();
        tag.value = value;
        await this.save(tag);
      });

    try {
      await Promise.all(promises());
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  /**
   * 태그를 삭제한다.
   *
   * @param tagId
   */
  async deleteTag(tagId: number) {
    if (!isFinite(tagId)) {
      throw new Error('유효한 숫자가 아닙니다.');
    }

    await this.exist(tagId);

    await this.delete(tagId);
  }

  /**
   * 태그 존재 여부 확인
   *
   * @param tagId
   * @returns
   */
  async exist(tagId: number) {
    const exist = await this.findOne({ where: { id: tagId } });

    if (!exist) {
      throw new Error('존재하지 않는 태그입니다.');
    }

    return true;
  }
}
