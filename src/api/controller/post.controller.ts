import { Request, Response } from 'express';

import {
  categoryService,
  PostCreateParamsEntity,
  PostCreateParamsDto,
  postService,
  PostUpdateParamsEntity,
  PostUpdateParamsDto,
  subCategoryService,
  tagService,
} from '@services';

export const getPosts = async (req: Request, res: Response) => {
  const { page = 1, per = 10 } = req.query;

  try {
    const { posts, total } = await postService().getPosts(
      Number(page),
      Number(per)
    );

    res
      .status(200)
      .send({ status: 200, payload: posts, meta: { total, page, per } });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};

export const getPost = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const post = await postService().getPostById(Number(id));
    res.status(200).send({ status: 200, payload: post });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};

export const createPost = async (req: Request, res: Response) => {
  const json: PostCreateParamsDto = req.body;
  const userId = req.user?.id as string;

  try {
    await categoryService().exist(json.categoryId);
    await subCategoryService().exist(json.subCategoryId);
    const { tags } = await tagService().getTags(json.tags);

    const params: PostCreateParamsEntity = {
      ...json,
      tags,
      userId,
    };
    await postService().createPost(params);

    res.status(201).send({ status: 201, payload: null });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  const json: PostUpdateParamsDto = req.body;
  const userId = req.user?.id as string;

  try {
    await categoryService().exist(json.categoryId);
    await subCategoryService().exist(json.subCategoryId);
    const { tags } = await tagService().getTags(json.tags);

    const params: PostUpdateParamsEntity = { ...json, tags, userId };
    await postService().updatePost(params);

    res.status(200).send({ status: 200, payload: null });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const postId = Number(id);

    await postService().deletePost(postId);
    res.status(200).send({ status: 200, payload: null });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};
