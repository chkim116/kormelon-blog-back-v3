import { NextFunction, Request, Response } from 'express';

import { subCategoryService } from '@services';

export const getSubCategories = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { categoryId } = req.query;

  try {
    const subCategories = await subCategoryService().getSubCategories(
      categoryId as unknown as number
    );

    next({ status: 200, payload: subCategories });
  } catch (err) {
    next(err);
  }
};

export const createSubCategory = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { categoryId, value } = req.body;
  try {
    await subCategoryService().createSubCategory(categoryId, value);

    next({ status: 201, payload: null });
  } catch (err) {
    next(err);
  }
};
export const updateSubCategory = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { id, value } = req.body;

  try {
    await subCategoryService().updateSubCategory(id, value);

    next({ status: 200, payload: null });
  } catch (err) {
    next(err);
  }
};
export const deleteSubCategory = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { id } = req.query;

  try {
    const categoryId = Number(id);

    await subCategoryService().deleteSubCategory(categoryId);

    next({ status: 200, payload: null });
  } catch (err) {
    next(err);
  }
};
