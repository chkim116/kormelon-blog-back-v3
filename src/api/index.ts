import { Router } from 'express';

import {
  categoryRouter,
  postRouter,
  subCategoryRouter,
  tagRouter,
  userRouter,
} from './routes';

export default () => {
  const app = Router();

  userRouter(app);
  categoryRouter(app);
  subCategoryRouter(app);
  postRouter(app);
  tagRouter(app);

  return app;
};
