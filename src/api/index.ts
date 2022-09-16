import { Router } from 'express';

import { categoryRouter, subCategoryRouter, userRouter } from './routes';

export default () => {
  const app = Router();

  userRouter(app);
  categoryRouter(app);
  subCategoryRouter(app);

  return app;
};
