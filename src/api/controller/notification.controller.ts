import { Request, Response } from 'express';

import { userService, notificationService } from '@services';

export const getNotifications = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const user = await userService().exist(userId);

    const notifications = await notificationService().getNotifications(user.id);

    res.status(200).send({ status: 200, payload: notifications });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};

export const readNotification = async (req: Request, res: Response) => {
  const { id } = req.body;
  const userId = req.user?.id;

  try {
    await notificationService().readNotification(id, userId || '');

    res.status(200).send({ status: 200, payload: null });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};
