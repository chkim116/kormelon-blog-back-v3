import { Router } from 'express';

import {
  categoryRouter,
  notificationRouter,
  postRouter,
  subCategoryRouter,
  tagRouter,
  userRouter,
  commentRouter,
  postPrivateRouter,
  viewRouter,
} from './routes';

export default () => {
  const app = Router();

  userRouter(app);
  categoryRouter(app);
  subCategoryRouter(app);
  postPrivateRouter(app);
  postRouter(app);
  tagRouter(app);
  commentRouter(app);
  notificationRouter(app);
  viewRouter(app);

  return app;
};
