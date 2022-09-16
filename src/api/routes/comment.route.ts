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
import { adminCheck, authCheck } from '../middlewares';

const router = Router();

export const commentRouter = (app: Router) => {
  app.use('/comment', router);

  router.get('/', getComments);
  router.post('/', authCheck, adminCheck, createComment);
  router.put('/', authCheck, adminCheck, updateComment);
  router.delete('/', authCheck, adminCheck, deleteComment);

  router.get('/reply', getCommentReplies);
  router.post('/reply', authCheck, adminCheck, createCommentReply);
  router.put('/reply', authCheck, adminCheck, updateCommentReply);
  router.delete('/reply', authCheck, adminCheck, deleteCommentReply);
};
