import { Request, Response } from 'express';

import { TagCreateParamsEntity, tagService } from '@services';

export const getTags = async (_: Request, res: Response) => {
  try {
    const { tags, total } = await tagService().getTags();
    res.status(200).send({ status: 200, payload: tags, meta: { total } });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};

export const getTagById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const tagId = Number(id);
    const tagById = await tagService().getTagById(tagId);

    res.status(200).send({ status: 200, payload: tagById });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};

export const createTags = async (req: Request, res: Response) => {
  const { values }: TagCreateParamsEntity = req.body;

  try {
    await tagService().createTags({ values });

    res.status(201).send({ status: 201, payload: null });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const tagId = Number(id);

    await tagService().deleteTag(tagId);

    res.status(200).send({ status: 200, payload: null });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};
