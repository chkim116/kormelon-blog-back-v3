import { NextFunction, Request, Response } from 'express';

import { validationResult } from 'express-validator';

export function validationCheck(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors.array()[0].msg;

    return res.status(400).send({ status: 400, message });
  }

  next();
}
