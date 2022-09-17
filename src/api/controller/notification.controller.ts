import { NextFunction, Request, Response } from 'express';

import { userService, notificationService } from '@services';

export const getNotifications = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  try {
    const user = await userService().exist(userId);

    const notifications = await notificationService().getNotifications(user.id);

    next({ status: 200, payload: notifications });
  } catch (err) {
    next(err);
  }
};

export const readNotification = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { id } = req.body;
  const userId = req.user?.id;

  try {
    await notificationService().readNotification(id, userId || '');

    next({ status: 200, payload: null });
  } catch (err) {
    next(err);
  }
};
