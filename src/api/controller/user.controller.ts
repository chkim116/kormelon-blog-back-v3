import { NextFunction, Request, Response } from 'express';

import { userService, UserSignInDto, UserSignUpDto } from '@services';

export const userSignUp = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { email, password, profileImage, username }: UserSignUpDto = req.body;
  try {
    await userService().signUp({ email, password, profileImage, username });

    next({ status: 201, payload: null });
  } catch (err) {
    next(err);
  }
};

export const userSignIn = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { email, password }: UserSignInDto = req.body;

  try {
    const { token, user } = await userService().signIn({ email, password });

    next({ status: 200, payload: { token, user } });
  } catch (err) {
    next(err);
  }
};
