import { Router } from 'express';

import { body } from 'express-validator';

import { userSignUp, userSignIn } from '../controller';
import { validationCheck } from '../middlewares';

const authRouter = Router();

export const userRouter = (app: Router) => {
  app.use('/auth', authRouter);

  authRouter.post(
    '/signup',
    [
      body('email', '이메일을 입력해 주세요.').exists().isEmail(),
      body('password', '비밀번호를 입력해 주세요.').exists(),
      body('profileImage', '유저 프로필 이미지를 선택해 주세요.').exists(),
      body('username', '사용할 닉네임을 입력해 주세요.').exists(),
      validationCheck,
    ],
    userSignUp
  );

  authRouter.post(
    '/signin',
    [
      body('email', '이메일을 입력해 주세요.').exists().isEmail(),
      body('password', '비밀번호를 입력해 주세요.').exists(),
      validationCheck,
    ],
    userSignIn
  );
};
