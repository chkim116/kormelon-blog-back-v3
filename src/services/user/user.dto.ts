export interface UserSignUpDto {
  /**
   * 유저의 이메일
   */
  email: string;
  /**
   * 유저의 프로필 사진
   *
   * front에서 기본 이미지를 주도록 권장. 현재 default 값은 없음.
   */
  profileImage?: string;
  /**
   * 유저가 사용할 이름
   */
  username?: string;
  /**
   * 유저의 비밀번호
   *
   * hash화 되어있다.
   */
  password: string;
}

export type UserSignInDto = Pick<UserSignUpDto, 'email' | 'password'>;
