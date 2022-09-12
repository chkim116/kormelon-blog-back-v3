import { Request, Response } from 'express';

import { userService, UserSignInDto, UserSignUpDto } from '@services';

export const userSignUp = async (req: Request, res: Response) => {
  const { email, password, profileImage, username }: UserSignUpDto = req.body;
  try {
    await userService().signUp({ email, password, profileImage, username });

    res.status(201).send({ status: 201, payload: null });
  } catch (err: any) {
    console.log(err);
    res.status(400).send({ status: 400, message: err.message });
  }
};

export const userSignIn = async (req: Request, res: Response) => {
  const { email, password }: UserSignInDto = req.body;

  try {
    const { token, user } = await userService().signIn({ email, password });

    res.status(200).send({ status: 200, payload: { token, user } });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};
