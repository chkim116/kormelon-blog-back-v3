import {
  EntityRepository,
  getCustomRepository,
  Like,
  Not,
  Repository,
} from 'typeorm';

import { env } from '@config';
import { Post } from '@models';
import readingTime from 'reading-time';

import {
  PostCreateParamsEntity,
  PostOrderDto,
  PostSearchParamsDto,
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
  async getPosts({
    keyword,
    per,
    page,
    categoryId,
    subCategoryId,
  }: PostSearchParamsDto) {
    const [posts, total] = await this.findAndCount({
      where: {
        isPrivate: false,
        ...(keyword && { title: Like(`%${keyword}%`) }),
        ...(categoryId && { categoryId }),
        ...(subCategoryId && { subCategoryId }),
      },
      select: ['title', 'id', 'preview', 'readTime', 'createdAt', 'thumbnail'],
      order: { id: 'DESC' },
      skip: (page - 1) * per,
      take: per,
    });

    return {
      total,
      posts,
    };
  }

  async getPostRss() {
    const posts = await this.createQueryBuilder('post')
      .where({ isPrivate: false })
      .select(['post.id', 'post.title', 'post.content', 'post.createdAt'])
      .getMany();

    return posts;
  }

  /**
   * 해당 태그가 있는 게시글들을 조회한다.
   */
  async getPostsByTagId(tagId: number) {
    const [posts, total] = await this.createQueryBuilder('post')
      .leftJoin('post.tags', 'tags')
      .addSelect(['tags.id'])
      .where('tags.id = :id', { id: tagId })
      .andWhere({ isPrivate: false })
      .select([
        'post.id',
        'post.title',
        'post.thumbnail',
        'post.preview',
        'post.createdAt',
        'post.readTime',
      ])
      .orderBy({ 'post.id': 'DESC' })
      .getManyAndCount();

    return {
      total,
      posts,
    };
  }

  /**
   * 비밀 유지 중인 게시글을 조회한다.
   *
   * @returns
   */
  async getPrivatePosts() {
    const [posts, total] = await this.createQueryBuilder('post')
      .where({ isPrivate: true })
      .select([
        'post.title',
        'post.id',
        'post.preview',
        'post.readTime',
        'post.createdAt',
        'post.thumbnail',
        'post.isPrivate',
      ])
      .orderBy({ 'post.id': 'DESC' })
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
  async getRecommendPosts(excludeId: number, take = 3, order: PostOrderDto) {
    const posts = await this.createQueryBuilder('post')
      .where({
        isPrivate: false,
      })
      .andWhere({
        id: Not(excludeId),
      })
      .select([
        'post.id',
        'post.title',
        'post.thumbnail',
        'post.createdAt',
        'post.readTime',
        'post.preview',
      ])
      .take(take)
      .orderBy({ [`post.${order}`]: 'DESC' })
      .getMany();

    return posts;
  }

  /**
   * 비밀 유지 중인 게시글을 상세 조회한다.
   *
   * @param id
   */
  async getPrivatePostById(id: number) {
    await this.privateExist(id);

    const post = await this.createQueryBuilder('post')
      .where({ id })
      .andWhere({ isPrivate: true })
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
        'post.isPrivate',
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

    return { post, next: null, prev: null };
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
      .andWhere({ isPrivate: false })
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
        'post.isPrivate',
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
        .andWhere({ isPrivate: false })
        .select(['post.id', 'post.title', 'post.thumbnail', 'post.createdAt'])
        .limit(1)
        .getOne(),
      await this.createQueryBuilder('post')
        .where('post.id < :id', { id })
        .andWhere({ isPrivate: false })
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
      readTime: readingTime(params.content, { wordsPerMinute: 300 }).minutes,
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

    await this.save({
      ...post,
      ...params,
      readTime: readingTime(params.content, { wordsPerMinute: 300 }).minutes,
    });
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
   * 비밀 게시글이 존재하는지 확인한다.
   *
   * @param id
   * @returns
   */
  async privateExist(id: number) {
    const post = await this.createQueryBuilder('post')
      .where({ isPrivate: true })
      .andWhere({ id });

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
