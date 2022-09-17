import { EntityRepository, getCustomRepository, Repository } from 'typeorm';

import { env } from '@config';
import { User } from '@models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { UserSignInDto, UserSignUpDto } from './user.dto';

export function userService() {
  return getCustomRepository(UserService, env.mode);
}

@EntityRepository(User)
class UserService extends Repository<User> {
  /**
   * 유저의 회원가입
   */
  async signUp({
    email,
    password,
    profileImage,
    username,
  }: UserSignUpDto): Promise<void> {
    const exist = await this.findByEmail(email);

    if (exist) {
      throw new Error('이미 존재하는 유저입니다.');
    }

    const existsUsername = await this.findOne({
      where: { username },
    });

    if (existsUsername) {
      throw new Error('이미 존재하는 유저 이름입니다.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      email,
      profileImage,
      password: hashPassword,
    };

    await this.save(newUser);
  }

  /**
   * 유저의 로그인
   */
  async signIn({ email, password }: UserSignInDto) {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new Error('존재하지 않는 유저입니다.');
    }

    const { password: userPassword, ...withoutPassword } = user;

    const isPasswordCorrect = await bcrypt.compare(password, userPassword);
    if (!isPasswordCorrect) {
      throw new Error('비밀번호가 틀립니다.');
    }

    // TODO: access, refresh
    const token = jwt.sign({ userId: user.id }, env.secret || 'warning');

    return { token, user: withoutPassword };
  }

  private findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({
      where: { email },
      select: ['id', 'profileImage', 'role', 'username', 'password'],
    });
  }
}
