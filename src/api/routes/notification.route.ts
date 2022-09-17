import { Router } from 'express';

import { getNotifications, readNotification } from '../controller';
import { authCheck } from '../middlewares';

const router = Router();

export const notificationRouter = (app: Router) => {
  app.use('/notification', router);

  router.get('/', authCheck(), getNotifications);
  router.post('/', authCheck(), readNotification);
};
