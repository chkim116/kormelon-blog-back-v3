import { EntityRepository, getCustomRepository, Repository } from 'typeorm';

import { env } from '@config';
import { User } from '@models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRoleEnum } from 'src/models/User';

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

  async getAuth(id: string) {
    const user = await this.createQueryBuilder('user')
      .where({ id })
      .leftJoin('user.posts', 'post')
      .addSelect(['post.id'])
      .leftJoin('user.comments', 'comment')
      .addSelect(['comment.id'])
      .getOne();

    return user;
  }

  /**
   * 유저가 어드민인지 확인한다.
   *
   * @param id
   * @returns
   */
  async checkAdmin(id?: string) {
    if (!id) {
      throw new Error('관리자가 아닙니다.');
    }

    const user = await this.findOne({ where: { id } });

    if (!user) {
      throw new Error('유저의 정보가 없습니다.');
    }

    if (user.role !== ('admin' as UserRoleEnum)) {
      throw new Error('관리자가 아닙니다.');
    }

    return user;
  }

  /**
   * 유저가 있는지 확인한다.
   *
   * @param id
   */
  async exist(id?: string) {
    if (!id) {
      throw new Error('로그인이 필요합니다.');
    }

    const exist = await this.findOne({ where: { id } });

    if (!exist) {
      throw new Error('유저의 정보가 없습니다.');
    }

    return exist;
  }

  private findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({
      where: { email },
      select: ['id', 'profileImage', 'role', 'username', 'password'],
    });
  }
}
