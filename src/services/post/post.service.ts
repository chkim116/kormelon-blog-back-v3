import {
  EntityRepository,
  getCustomRepository,
  Like,
  Repository,
} from 'typeorm';

import { env } from '@config';
import { Post } from '@models';
import readingTime from 'reading-time';

import {
  PostCreateParamsEntity,
  PostOrderDto,
  PostUpdateParamsEntity,
} from './post.dto';

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
   * @params keyword 페이지 제목
   * @params subCategoryId 카테고리 아이디
   * @returns
   */
  async getPosts(
    page: number,
    per: number,
    keyword: string,
    subCategoryId?: number
  ) {
    let searchedPosts = await this.createQueryBuilder('post')
      .where({ title: Like(`%${keyword}%`) })
      .orWhere({ content: Like(`%${keyword}%`) })
      .select(['post.subCategoryId', 'post.categoryId']);

    if (subCategoryId) {
      searchedPosts = await searchedPosts.where({ subCategoryId });
    }

    const [posts, total] = await searchedPosts
      .select([
        'post.title',
        'post.id',
        'post.preview',
        'post.readTime',
        'post.createdAt',
        'post.thumbnail',
      ])
      .orderBy({ 'post.id': 'DESC' })
      .skip((page - 1) * per)
      .take(per)
      .getManyAndCount();

    return {
      total,
      posts,
    };
  }

  /**
   * 추천 게시글을 조회한다.
   *
   * @param take 조회할 개수
   * @param order 조회 기준점. like or view
   * @returns
   */
  async getRecommendPosts(take = 3, order: PostOrderDto) {
    const posts = await this.find({
      select: ['id', 'title', 'thumbnail', 'createdAt', 'readTime', 'preview'],
      order: { [`${order}`]: 'DESC' },
      take,
    });

    return posts;
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
        'post.preview',
        'post.readTime',
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

    const [next = null, prev = null] = await Promise.all([
      await this.createQueryBuilder('post')
        .where('post.id > :id', { id })
        .select(['post.id', 'post.title', 'post.thumbnail', 'post.createdAt'])
        .limit(1)
        .getOne(),
      await this.createQueryBuilder('post')
        .where('post.id < :id', { id })
        .orderBy({ id: 'DESC' })
        .select(['post.id', 'post.title', 'post.thumbnail', 'post.createdAt'])
        .limit(1)
        .getOne(),
    ]);

    return { post, next, prev };
  }

  /**
   * 게시글을 생성한다.
   * @param params
   */
  async createPost(params: PostCreateParamsEntity) {
    const post = await this.create({
      ...params,
      readTime: readingTime(params.content, { wordsPerMinute: 500 }).minutes,
    });

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

  /**
   * 현재 유저가 특정 게시글의 작성자인지 확인한다.
   *
   * @param postId
   * @param userId
   * @returns
   */
  async checkAuthor(postId: number, userId: string) {
    const exist = await this.createQueryBuilder('post')
      .where({ id: postId })
      .andWhere({ userId })
      .getCount();

    return Boolean(exist);
  }
}
