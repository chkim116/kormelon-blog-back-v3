import { Router } from 'express';

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
import { authCheck } from '../middlewares';

const router = Router();

export const commentRouter = (app: Router) => {
  app.use('/comment', router);

  router.get('/', getComments);
  router.post('/', authCheck(false), createComment);
  router.put('/', authCheck(false), updateComment);
  router.delete('/', authCheck(false), deleteComment);

  router.get('/reply', getCommentReplies);
  router.post('/reply', authCheck(false), createCommentReply);
  router.put('/reply', authCheck(false), updateCommentReply);
  router.delete('/reply', authCheck(false), deleteCommentReply);
};
