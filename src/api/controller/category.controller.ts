import { Request, Response } from 'express';

import { categoryService } from '@services';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService().getCategories();

    res.status(200).send({ status: 200, payload: categories });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { value } = req.body;

  try {
    await categoryService().createCategory(value);

    res.status(200).send({ status: 200, payload: null });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const { value, categoryId } = req.body;
  try {
    await categoryService().updateCategory(categoryId, value);

    res.status(200).send({ status: 200, payload: null });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const categoryId = Number(id);

    await categoryService().deleteCategory(categoryId);

    res.status(200).send({ status: 200, payload: null });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};
