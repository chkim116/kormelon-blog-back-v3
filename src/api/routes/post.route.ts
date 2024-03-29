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
  getPostsByTagId,
  getPostRss,
} from '../controller';
import { validationCheck } from '../middlewares';
import { adminCheck } from '../middlewares/adminCheck';
import { authCheck } from '../middlewares/authCheck';
import { uploadImage } from '../middlewares/uploadImage';

const router = Router();
const routerPrivate = Router();

export const postPrivateRouter = (app: Router) => {
  app.use('/private', routerPrivate);

  routerPrivate.get('/', authCheck(), adminCheck, getPrivatePosts);
  routerPrivate.get('/:id', authCheck(), adminCheck, getPrivatePostById);
};

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
    '/search/tag',
    query('tagId', '태그 Id는 Number 타입이어야 합니다.')
      .optional()
      .isNumeric(),
    getPostsByTagId
  );
  router.get(
    '/recommend',
    [
      query('excludeId', '게시글 id는 Number 타입이어야 합니다.').isNumeric(),
      query('take', 'take는 숫자여야 합니다.').optional().isNumeric(),
      query('order', 'order는 like 또는 view여야 합니다.')
        .optional()
        .isIn(['like', 'view']),
      validationCheck,
    ],
    getRecommendPosts
  );
  router.get('/rss', getPostRss);
  router.get('/:id', getPostById);
  router.put('/:id', authCheck(false), addPostView);
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

  router.post('/image', uploadImage, uploadPostImage);
};
