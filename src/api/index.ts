import { Router } from 'express';

import {
  categoryRouter,
  postRouter,
  subCategoryRouter,
  tagRouter,
  userRouter,
} from './routes';
import { commentRouter } from './routes/comment.route';

export default () => {
  const app = Router();

  userRouter(app);
  categoryRouter(app);
  subCategoryRouter(app);
  postRouter(app);
  tagRouter(app);
  commentRouter(app);

  return app;
};
