import { Router } from 'express';

import { body, query } from 'express-validator';

import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  getCommentReplies,
  createCommentReply,
  deleteCommentReply,
  updateCommentReply,
} from '../controller';
import { authCheck, validationCheck } from '../middlewares';

const router = Router();

export const commentRouter = (app: Router) => {
  app.use('/comment', router);

  router.get('/', getComments);
  router.post(
    '/',
    authCheck(false),
    [
      body('postId', '올바른 게시글 id가 필요합니다.').exists().isNumeric(),
      body('value', '댓글을 입력해 주세요.').exists().isString(),
      validationCheck,
    ],
    createComment
  );
  router.put(
    '/',
    authCheck(false),
    [
      body('postId', '게시글 id가 필요합니다.').exists().isNumeric(),
      body('value', '댓글을 입력해 주세요.').exists().isString(),
      validationCheck,
    ],
    updateComment
  );
  router.delete(
    '/',
    authCheck(false),
    [
      query('id', '삭제할 댓글의 id가 필요합니다.').exists().isString(),
      validationCheck,
    ],
    deleteComment
  );

  router.get('/reply', getCommentReplies);
  router.post(
    '/reply',
    authCheck(false),
    [
      body('postId', '게시글 id가 필요합니다.').exists().isNumeric(),
      body('value', '댓글을 입력해 주세요.').exists().isString(),
      validationCheck,
    ],
    createCommentReply
  );
  router.put(
    '/reply',
    authCheck(false),
    [
      body('postId', '게시글 id가 필요합니다.').exists().isNumeric(),
      body('value', '댓글을 입력해 주세요.').exists().isString(),
      validationCheck,
    ],
    updateCommentReply
  );
  router.delete(
    '/reply',
    authCheck(false),
    [
      query('id', '삭제할 댓글의 id가 필요합니다.').exists().isString(),
      validationCheck,
    ],
    deleteCommentReply
  );
};
