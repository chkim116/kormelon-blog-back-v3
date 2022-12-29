import { NextFunction, Request, Response } from 'express';

import requestIp from 'request-ip';

import { viewService } from '../../services/view';

export const getView = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isAdmin = req.user?.role === 'admin';
  const clientIp = requestIp.getClientIp(req);

  try {
    const { today, total, ips } = await viewService().getView();

    if (isAdmin || !clientIp || ips.includes(clientIp)) {
      next({
        status: 200,
        payload: {
          today,
          total,
        },
      });
      return;
    }

    const newView = await viewService().addView(clientIp);

    next({
      status: 200,
      payload: {
        today: newView.today,
        total: newView.total,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const cronCalculateView = async () => {
  await viewService().calculateView();
};
