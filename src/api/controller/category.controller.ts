import { NextFunction, Request, Response } from 'express';

import { categoryService } from '@services';

export const getCategories = async (
  _: Request,
  __: Response,
  next: NextFunction
) => {
  try {
    const categories = await categoryService().getCategories();

    next({ status: 200, payload: categories });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { value } = req.body;

  try {
    await categoryService().createCategory(value);

    next({ status: 200, payload: null });
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { value, categoryId } = req.body;
  try {
    await categoryService().updateCategory(categoryId, value);

    next({ status: 200, payload: null });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { id } = req.query;

  try {
    const categoryId = Number(id);

    await categoryService().deleteCategory(categoryId);

    next({ status: 200, payload: null });
  } catch (err) {
    next(err);
  }
};
