import { Router } from 'express';

import { body, query } from 'express-validator';

import { createTags, deleteTag, getTagById, getTags } from '../controller';
import { validationCheck, adminCheck, authCheck } from '../middlewares';

const router = Router();

export const tagRouter = (app: Router) => {
  app.use('/tag', router);

  router.get('/', getTags);
  router.get('/:id', getTagById);
  router.post(
    '/',
    authCheck(),
    adminCheck,
    [
      body('values', '태그를 입력해 주세요.').isArray().exists(),
      validationCheck,
    ],
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
