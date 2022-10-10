import { Router } from 'express';

import { body, query } from 'express-validator';

import {
  createPost,
  deletePost,
  getPosts,
  getPostById,
  updatePost,
  likePost,
  uploadPostImage,
  getRecommendPosts,
  addPostView,
  getPrivatePosts,
  getPrivatePostById,
} from '../controller';
import { validationCheck } from '../middlewares';
import { adminCheck } from '../middlewares/adminCheck';
import { authCheck } from '../middlewares/authCheck';
import { uploadImage } from '../middlewares/uploadImage';

const router = Router();

export const postRouter = (app: Router) => {
  app.use('/post', router);

  router.get(
    '/',
    [
      query('page', '페이지 단위는 숫자여야 합니다.').optional().isNumeric(),
      query('per', '게시글 개수는 숫자여야 합니다.').optional().isNumeric(),
      query('subCategoryId', '카테고리의 식별자는 숫자여야 합니다.')
        .optional()
        .isNumeric(),
      validationCheck,
    ],
    getPosts
  );
  router.get(
    '/recommend',
    [
      query('take', 'take는 숫자여야 합니다.').optional().isNumeric(),
      query('order', 'order는 like 또는 view여야 합니다.')
        .optional()
        .isIn(['like', 'view']),
      validationCheck,
    ],
    getRecommendPosts
  );
  router.get('/:id', getPostById);
  router.put('/:id', authCheck(), addPostView);
  router.post(
    '/',
    authCheck(),
    adminCheck,
    [
      body('thumbnail', '이미지를 입력해 주세요.').exists(),
      body('preview', '미리보기 내용을 입력해 주세요.').exists(),
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
    authCheck(),
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
    authCheck(),
    adminCheck,
    [
      query('id', '삭제할 id가 필요합니다.').exists().isNumeric(),
      validationCheck,
    ],
    deletePost
  );
  router.post(
    '/like',
    [query('id', 'id가 필요합니다.').exists().isNumeric(), validationCheck],
    likePost
  );

  router.get('/private', authCheck(true), adminCheck, getPrivatePosts);
  router.get('/private/:id', authCheck(true), adminCheck, getPrivatePostById);

  router.post('/image', uploadImage, uploadPostImage);
};
