import { NextFunction, Request, Response } from 'express';

import { env } from '@config';
import { userService } from '@services';
import jwt from 'jsonwebtoken';

export function authCheck(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;

  if (!token) {
    res.status(400).send({ status: 400, message: '로그인이 필요합니다.' });
    return;
  }

  jwt.verify(token, env.secret || 'warning', async (err, decoded) => {
    if (err) {
      res
        .status(500)
        .send({ status: 500, message: '올바르지 않은 토큰입니다.' });
      return;
    }

    const user = await userService().getAuth(
      (decoded as Record<'userId', string>)?.userId
    );

    if (!user) {
      next();
    }

    req.user = user;
    next();
  });
}
