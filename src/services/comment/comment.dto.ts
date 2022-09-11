export interface CommentCreateParams {
  /**
   * 댓글 텍스트
   */
  value: string;
  /**
   * 댓글 작성의 유저 닉네임
   *
   * 익명이라면 username을 따로 받으며,
   * 유저라면 유저 정보에서 username을 받는다.
   */
  username: string;
  /**
   * 댓글의 비밀번호
   */
  password: string;
  /**
   * 댓글의 익명 여부
   */
  isAnonymous: boolean;
}

export interface CommentUpdateParams extends CommentCreateParams {
  id: string;
}
