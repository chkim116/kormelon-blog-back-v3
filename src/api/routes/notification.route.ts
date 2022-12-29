import { Router } from 'express';

import { body } from 'express-validator';

import { getNotifications, readNotification } from '../controller';
import { authCheck } from '../middlewares';

const router = Router();

export const notificationRouter = (app: Router) => {
  app.use('/notification', router);

  router.get('/', authCheck(), getNotifications);
  router.post(
    '/',
    authCheck(),
    [body('id', '알림의 id가 필요합니다.').exists().isNumeric()],
    readNotification
  );
};
