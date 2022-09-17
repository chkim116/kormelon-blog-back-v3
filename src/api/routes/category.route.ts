import { Router } from 'express';

import { body, query } from 'express-validator';

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../controller';
import { validationCheck } from '../middlewares';
import { adminCheck } from '../middlewares/adminCheck';
import { authCheck } from '../middlewares/authCheck';

const router = Router();

export const categoryRouter = (app: Router) => {
  app.use('/category', router);

  router.get('/', getCategories);
  router.post(
    '/',
    authCheck,
    adminCheck,
    [body('value', '카테고리의 값을 입력해 주세요').exists(), validationCheck],
    createCategory
  );
  router.put(
    '/',
    authCheck,
    adminCheck,
    [
      body('value', '카테고리의 값을 입력해 주세요').exists(),
      body('categoryId', '카테고리의 id 값이 필요합니다.').exists().isNumeric(),
      validationCheck,
    ],
    updateCategory
  );
  router.delete(
    '/',
    authCheck,
    adminCheck,
    [
      query('id', '삭제할 카테고리의 id 값이 필요합니다.').exists().isNumeric(),
      validationCheck,
    ],
    deleteCategory
  );
};
