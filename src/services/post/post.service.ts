import { Repository } from 'typeorm';

import { Post } from '@models';

import { PostCreateParams, PostUpdateParams } from './post.dto';

export class postService {
  constructor(private postRepository: Repository<Post>) {}

  /**
   * 게시글을 생성한다.
   * @param params
   */
  async create(params: PostCreateParams) {
    const post = await this.postRepository.create(params);

    await this.postRepository.save(post);
  }

  /**
   * 게시글을 수정한다.
   * @param param0
   */
  async update({ id, ...params }: PostUpdateParams) {
    await this.postRepository.update(id, params);
  }

  /**
   * 게시글을 삭제한다.
   * @param id
   */
  async delete(id: number) {
    await this.postRepository.delete(id);
  }
}
