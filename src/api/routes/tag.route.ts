import { Router } from 'express';

import { body, query } from 'express-validator';

import {
  createTags,
  deleteTag,
  getTagById,
  getTags,
  getTagsByValue,
} from '../controller';
import { validationCheck, adminCheck, authCheck } from '../middlewares';

const router = Router();

export const tagRouter = (app: Router) => {
  app.use('/tag', router);

  router.get('/', getTags);
  router.get('/:value', getTagsByValue);
  router.get('/:id', getTagById);
  router.post(
    '/',
    authCheck(),
    adminCheck,
    [body('value', '태그를 입력해 주세요.').exists(), validationCheck],
    createTags
  );
  router.delete(
    '/',
    authCheck(),
    adminCheck,
    [
      query('id', '삭제할 태그의 id가 필요합니다.').exists().isNumeric(),
      validationCheck,
    ],
    deleteTag
  );
};
