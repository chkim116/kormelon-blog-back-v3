export interface CommentCreateParamsDto {
  /**
   * 댓글 텍스트
   */
  value: string;
  /**
   * 게시글 아이디
   */
  postId: number;
  /**
   * 댓글 작성의 유저 닉네임
   *
   * 익명이라면 username을 따로 받으며,
   * 유저라면 유저 정보에서 username을 받는다.
   */
  username?: string;
  /**
   * 댓글의 비밀번호
   */
  password?: string;
}

export interface CommentCreateParamsEntity
  extends Required<CommentCreateParamsDto> {
  /**
   * 유저의 id 여부
   */
  userId: string | null;
  /**
   * 댓글의 익명 여부
   */
  isAnonymous?: boolean;
}

export interface CommentUpdateParamsDto extends CommentCreateParamsDto {
  /**
   * 코멘트의 식별자
   */
  id: string;
}

export interface CommentUpdateParamsEntity extends CommentCreateParamsEntity {
  /**
   * 코멘트의 식별자
   */
  id: string;
}
