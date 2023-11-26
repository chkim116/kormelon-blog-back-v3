import { NextFunction, Request, Response } from 'express';

import {
  categoryService,
  PostCreateParamsEntity,
  PostCreateParamsDto,
  postService,
  PostUpdateParamsEntity,
  PostUpdateParamsDto,
  subCategoryService,
  tagService,
  PostOrderDto,
} from '@services';

export const getPosts = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const {
    page = 1,
    per = 10,
    keyword = '',
    categoryId,
    subCategoryId,
  } = req.query;

  try {
    const { posts, total } = await postService().getPosts({
      categoryId: Number(categoryId || 0),
      keyword: String(keyword),
      page: Number(page),
      per: Number(per),
      subCategoryId: Number(subCategoryId || 0),
    });

    next({
      status: 200,
      payload: posts,
      meta: { total, page: Number(page), per: Number(per) },
    });
  } catch (err) {
    next(err);
  }
};

export const getPostRss = async (
  _: Request,
  __: Response,
  next: NextFunction
) => {
  try {
    const posts = await postService().getPostRss();

    next({
      status: 200,
      payload: posts,
    });
  } catch (err) {
    next(err);
  }
};

export const getPostsByTagId = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { tagId } = req.query;

  try {
    const { posts, total } = await postService().getPostsByTagId(Number(tagId));

    next({
      status: 200,
      payload: posts,
      meta: { total },
    });
  } catch (err) {
    next(err);
  }
};

export const getRecommendPosts = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { take = 3, order = 'like' } = req.query;

  try {
    const posts = await postService().getRecommendPosts(
      Number(take),
      String(order) as PostOrderDto
    );

    next({ status: 200, payload: posts });
  } catch (err) {
    next(err);
  }
};

export const getPrivatePosts = async (
  _: Request,
  __: Response,
  next: NextFunction
) => {
  try {
    const { posts, total } = await postService().getPrivatePosts();

    next({
      status: 200,
      payload: posts,
      meta: { total },
    });
  } catch (err) {
    next(err);
  }
};

export const addPostView = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const isAdmin = req.user?.role;

  try {
    if (isAdmin) {
      return;
    }

    await postService().addPostView(Number(id));

    next({ status: 200, payload: null });
  } catch (err) {
    next(err);
  }
};

export const getPostById = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const post = await postService().getPostById(Number(id));

    next({ status: 200, payload: post });
  } catch (err) {
    next(err);
  }
};

export const getPrivatePostById = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const post = await postService().getPrivatePostById(Number(id));

    next({ status: 200, payload: post });
  } catch (err) {
    next(err);
  }
};

export const createPost = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const json: PostCreateParamsDto = req.body;
  const userId = req.user?.id as string;

  try {
    await categoryService().exist(json.categoryId);
    await subCategoryService().exist(json.subCategoryId);

    const { tags } = json.tags.length
      ? await tagService().getTags(json.tags)
      : {
          tags: [],
        };

    const params: PostCreateParamsEntity = {
      ...json,
      tags,
      userId,
    };
    await postService().createPost(params);

    next({ status: 201, payload: null });
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const json: PostUpdateParamsDto = req.body;
  const userId = req.user?.id as string;

  try {
    await categoryService().exist(json.categoryId);
    await subCategoryService().exist(json.subCategoryId);
    const { tags } = json.tags.length
    ? await tagService().getTags(json.tags)
    : {
        tags: [],
      };

    const params: PostUpdateParamsEntity = { ...json, tags, userId };
    await postService().updatePost(params);

    next({ status: 200, payload: null });
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { id } = req.query;

  try {
    const postId = Number(id);

    await postService().deletePost(postId);
    next({ status: 200, payload: null });
  } catch (err) {
    next(err);
  }
};

export const likePost = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { id } = req.query;

  try {
    const postId = Number(id);

    await postService().addPostLike(postId);

    next({ status: 200, payload: null });
  } catch (err) {
    next(err);
  }
};

export const uploadPostImage = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { file } = req;

  try {
    if (!file) {
      throw new Error('이미지 처리 중 오류가 발생했습니다.');
    }

    if ('location' in file) {
      next({ status: 200, payload: file.location });
      return;
    }

    throw new Error('location이 존재하지 않습니다.');
  } catch (err) {
    next(err);
  }
};
