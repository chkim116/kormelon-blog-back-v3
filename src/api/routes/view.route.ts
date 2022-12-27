import { Router } from 'express';

import { getView } from '../controller';

const router = Router();

export const viewRouter = (app: Router) => {
  app.use('/view', router);

  router.get('/', getView);
};
