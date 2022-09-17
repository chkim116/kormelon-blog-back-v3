import { NextFunction, Request, Response } from 'express';

import { HttpError } from './errorHandler';

interface PayloadProps<T, M> {
  status: number;
  payload: T;
  meta?: M;
}

function isObject(val: unknown): val is Record<string, unknown> {
  return Object.prototype.toString.call(val) === '[object Object]';
}

function instanceOfPayloadProps<T, M>(val: unknown): val is PayloadProps<T, M> {
  return isObject(val) && 'status' in val && 'payload' in val;
}

/**
 * payload를 핸들링하여 클라이언트에게 보낸다.
 *
 * controller에서 try catch 문을 이용할 시 사용되는 미들웨어이다.
 *
 * errorHandler 전에 발동된다.
 *
 * @param props
 * @param res
 * @returns
 */
export const payloadHandler = <T extends null, M>(
  props: PayloadProps<T, M> | HttpError,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  if (instanceOfPayloadProps(props)) {
    const { meta = null, payload = null, status = 200 } = props;

    return res.status(status).send({
      status,
      payload,
      meta,
    });
  }

  next(props);
};
