export interface NotificationCreateParamsDto {
  /**
   * 작성된 댓글이 위치한 게시글 id
   */
  postId: number;
  /**
   * 작성한 댓글 id
   *
   * comment 생성 시 notification이 저장된다.
   */
  commentId: string;
  /**
   * 알림이 저장될 유저의 id 값
   */
  userId: string | null;
}
