import { NextFunction, Request, Response } from 'express';

import { env } from '@config';

export interface HttpError extends Error {
  status?: number;
}

/**
 * 에러를 핸들링하여 클라이언트에게 보낸다
 *
 * controller에서 try catch 문을 이용할 시 사용되는 미들웨어이다.
 *
 * @param err
 * @param req
 * @param res
 */
export const errorHandler = (
  err: HttpError,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  err.status = err.status || 400;

  console.log('ERROR BODY ====>>>> ', err, '\n');
  console.log('ERROR MESSAGE ====>>>> ', err.message, '\n');

  return res
    .status(err.status)
    .send({ status: err.status, message: err.message });
};
