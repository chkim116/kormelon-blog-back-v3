import { NextFunction, Request, Response } from 'express';

import { env } from '@config';
import { userService } from '@services';
import jwt from 'jsonwebtoken';

/**
 * 유저가 로그인하였는지 체크한다.
 *
 * 내부적으로 header의 authorization 속성에 의존한다.
 *
 * 현 미들웨어 이후 로직에 유저의 여부가 꼭 필요하지 않다면 false로 인자를 주면 된다.
 *
 * @param required
 * @returns
 */
export function authCheck(required = true) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.headers.authorization || req.cookies['kormelon_token'] || '';

    if (!token) {
      if (required) {
        return res
          .status(400)
          .send({ status: 400, message: '로그인이 필요합니다.' });
      }

      return next();
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
  };
}
