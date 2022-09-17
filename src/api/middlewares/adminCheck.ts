import { NextFunction, Request, Response } from 'express';

import { userService } from '@services';

export async function adminCheck(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?.id;

  try {
    await userService().checkAdmin(userId);
    next();
  } catch (err: any) {
    return res.status(401).send({ status: 401, message: err.message });
  }
}
