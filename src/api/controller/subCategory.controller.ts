import { Request, Response } from 'express';

import { subCategoryService } from '@services';

export const getSubCategories = async (req: Request, res: Response) => {
  try {
    const subCategories = await subCategoryService().getSubCategories();

    res.status(200).send({ status: 200, payload: subCategories });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};

export const createSubCategory = async (req: Request, res: Response) => {
  const { categoryId, value } = req.body;
  try {
    await subCategoryService().createSubCategory(categoryId, value);

    res.status(201).send({ status: 201, payload: null });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};
export const updateSubCategory = async (req: Request, res: Response) => {
  const { id, value } = req.body;

  try {
    await subCategoryService().updateSubCategory(id, value);

    res.status(200).send({ status: 200, payload: null });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};
export const deleteSubCategory = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const categoryId = Number(id);

    await subCategoryService().deleteSubCategory(categoryId);
    res.status(200).send({ status: 200, payload: null });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};
