import { Router } from 'express';

import {
  categoryRouter,
  notificationRouter,
  postRouter,
  subCategoryRouter,
  tagRouter,
  userRouter,
  commentRouter,
} from './routes';

export default () => {
  const app = Router();

  userRouter(app);
  categoryRouter(app);
  subCategoryRouter(app);
  postRouter(app);
  tagRouter(app);
  commentRouter(app);
  notificationRouter(app);

  return app;
};
