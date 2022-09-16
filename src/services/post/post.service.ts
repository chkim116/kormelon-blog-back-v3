import { EntityRepository, getCustomRepository, Repository } from 'typeorm';

import { env } from '@config';
import { Post } from '@models';

import { PostCreateParamsEntity, PostUpdateParamsEntity } from './post.dto';

export function postService() {
  return getCustomRepository(PostService, env.mode);
}

@EntityRepository(Post)
class PostService extends Repository<Post> {
  /**
   * 전체 게시글들을 조회한다.
   *
   * @param page 페이지 단위
   * @param per 페이지 당 게시글 수
   * @returns
   */
  async getPosts(page: number, per: number) {
    const posts = await this.createQueryBuilder('post')
      .select([
        'post.title',
        'post.id',
        'post.createdAt',
        'post.thumbnail',
        'post.view',
        'post.like',
      ])
      .leftJoin('post.category', 'category')
      .addSelect(['category.id', 'category.value'])
      .leftJoin('post.subCategory', 'subCategory')
      .addSelect(['subCategory.id', 'subCategory.value'])
      .leftJoin('post.comments', 'comment')
      .addSelect(['comment.id'])
      .skip((page - 1) * per)
      .take(per)
      .getMany();

    const total = await this.count();

    return {
      total,
      posts,
    };
  }

  /**
   * 게시글 상세 조회
   *
   * @param id
   */
  async getPostById(id: number) {
    await this.exist(id);

    const post = await this.createQueryBuilder('post')
      .where({ id })
      .select([
        'post.id',
        'post.title',
        'post.thumbnail',
        'post.content',
        'post.view',
        'post.createdAt',
        'post.like',
      ])
      .leftJoin('post.category', 'category')
      .addSelect(['category.id', 'category.value'])
      .leftJoin('post.subCategory', 'subCategory')
      .addSelect(['subCategory.id', 'subCategory.value'])
      .leftJoin('post.user', 'user')
      .addSelect(['user.id', 'user.username', 'user.profileImage'])
      .leftJoin('post.tags', 'tag')
      .addSelect(['tag.id', 'tag.value'])
      .getOne();

    return post;
  }

  /**
   * 게시글을 생성한다.
   * @param params
   */
  async createPost(params: PostCreateParamsEntity) {
    const post = await this.create(params);

    await this.save(post);
  }

  /**
   * 게시글을 수정한다.
   *
   * @param param0
   */
  async updatePost({ id, ...params }: PostUpdateParamsEntity) {
    const post = await this.exist(id);

    await this.save({ ...post, ...params });
  }

  /**
   * 게시글을 삭제한다.
   * @param id
   */
  async deletePost(id: number) {
    if (!isFinite(id)) {
      throw new Error('유효한 숫자가 아닙니다.');
    }

    await this.exist(id);

    await this.delete(id);
  }

  /**
   * 게시글 좋아요
   *
   * @param id
   */
  async addPostLike(id: number) {
    if (!isFinite(id)) {
      throw new Error('유효한 숫자가 아닙니다.');
    }

    const { like } = await this.exist(id);

    await this.update(id, { like: like + 1 });
  }

  /**
   * 게시글 조회수 증가
   *
   * @param id
   */
  async addPostView(id: number) {
    if (!isFinite(id)) {
      throw new Error('유효한 숫자가 아닙니다.');
    }

    const { view } = await this.exist(id);

    await this.update(id, { view: view + 1 });
  }

  /**
   * 게시글이 존재하는지 확인한다.
   *
   * @param id
   * @returns
   */
  async exist(id: number) {
    const post = await this.findOne({ where: { id } });

    if (!post) {
      throw new Error('존재하지 않는 게시글입니다.');
    }

    return post;
  }
}
