import { Router } from 'express';

import { body, query } from 'express-validator';

import {
  createPost,
  deletePost,
  getPosts,
  getPost,
  updatePost,
} from '../controller/post.controller';
import { validationCheck } from '../middlewares';
import { adminCheck } from '../middlewares/adminCheck';
import { authCheck } from '../middlewares/authCheck';

const router = Router();

export const postRouter = (app: Router) => {
  app.use('/post', router);

  router.get(
    '/',
    [
      query('page', '페이지 단위는 숫자여야 합니다.').optional().isNumeric(),
      query('per', '게시글 개수는 숫자여야 합니다.').optional().isNumeric(),
      validationCheck,
    ],
    getPosts
  );
  router.get('/:id', getPost);
  router.post(
    '/',
    authCheck,
    adminCheck,
    [
      body('thumbnail', '이미지를 입력해 주세요.').exists(),
      body('title', '제목을 입력해 주세요.').exists(),
      body('content', '본문을 입력해 주세요.').exists(),
      body('categoryId', '카테고리를 선택해 주세요.').exists().isNumeric(),
      body('subCategoryId', '하위 카테고리를 선택해 주세요.')
        .exists()
        .isNumeric(),
      validationCheck,
    ],
    createPost
  );
  router.put(
    '/',
    authCheck,
    adminCheck,
    [
      body('id', '게시글 id를 입력해 주세요.').exists().isNumeric(),
      body('thumbnail', '이미지를 입력해 주세요.').exists(),
      body('title', '제목을 입력해 주세요.').exists(),
      body('content', '본문을 입력해 주세요.').exists(),
      body('categoryId', '카테고리를 선택해 주세요.').exists().isNumeric(),
      body('subCategoryId', '하위 카테고리를 선택해 주세요.')
        .exists()
        .isNumeric(),
      validationCheck,
    ],
    updatePost
  );
  router.delete(
    '/',
    authCheck,
    adminCheck,
    [query('id', '삭제할 id를 입력해 주세요.').exists().isNumeric()],
    deletePost
  );
};
