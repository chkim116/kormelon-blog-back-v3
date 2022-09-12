import { Router } from 'express';

import { categoryRouter, userRouter } from './routes';

export default () => {
  const app = Router();

  userRouter(app);
  categoryRouter(app);

  return app;
};
