import { Router } from 'express';

import { userRouter } from './routes';

export default () => {
  const app = Router();

  userRouter(app);

  return app;
};
