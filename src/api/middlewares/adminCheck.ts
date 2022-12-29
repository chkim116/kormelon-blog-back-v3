import { NextFunction, Request, Response } from 'express';

import { userService } from '@services';

/**
 * 유저가 어드민인지 확인한다.
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
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
