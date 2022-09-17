import { NextFunction, Request, Response } from 'express';

import { TagCreateParamsEntity, tagService } from '@services';

export const getTags = async (_: Request, __: Response, next: NextFunction) => {
  try {
    const { tags, total } = await tagService().getTags();

    next({ status: 200, payload: tags, meta: { total } });
  } catch (err) {
    next(err);
  }
};

export const getTagById = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const tagId = Number(id);
    const tagById = await tagService().getTagById(tagId);

    next({ status: 200, payload: tagById });
  } catch (err) {
    next(err);
  }
};

export const createTags = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { values }: TagCreateParamsEntity = req.body;

  try {
    await tagService().createTags({ values });

    next({ status: 201, payload: null });
  } catch (err) {
    next(err);
  }
};

export const deleteTag = async (
  req: Request,
  __: Response,
  next: NextFunction
) => {
  const { id } = req.query;

  try {
    const tagId = Number(id);

    await tagService().deleteTag(tagId);

    next({ status: 200, payload: null });
  } catch (err) {
    next(err);
  }
};
