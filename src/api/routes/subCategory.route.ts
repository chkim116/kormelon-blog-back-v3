import { Router } from 'express';

import { body, query } from 'express-validator';

import {
  getSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from '../controller';
import { validationCheck } from '../middlewares';
import { adminCheck } from '../middlewares/adminCheck';
import { authCheck } from '../middlewares/authCheck';

const router = Router();

export const subCategoryRouter = (app: Router) => {
  app.use('/subCategory', router);

  router.get('/', getSubCategories);
  router.post(
    '/',
    authCheck(),
    adminCheck,
    [
      body('value', '카테고리의 값을 입력해 주세요').exists(),
      body('categoryId', '상위 카테고리의 id 값이 필요합니다.')
        .exists()
        .isNumeric(),
      validationCheck,
    ],
    createSubCategory
  );
  router.put(
    '/',
    authCheck(),
    adminCheck,
    [
      body('value', '카테고리의 값을 입력해 주세요').exists(),
      body('id', '수정할 카테고리의 id 값이 필요합니다.').exists().isNumeric(),
      validationCheck,
    ],
    updateSubCategory
  );
  router.delete(
    '/',
    authCheck(),
    adminCheck,
    [
      query('id', '삭제할 카테고리의 id 값이 필요합니다.').exists().isNumeric(),
      validationCheck,
    ],
    deleteSubCategory
  );
};
