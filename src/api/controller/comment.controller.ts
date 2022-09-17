import { NextFunction, Request, Response } from 'express';

import {
  CommentCreateParamsDto,
  CommentReplyCreateParamsDto,
  commentReplyService,
  commentService,
  CommentUpdateParamsDto,
  postService,
  notificationService,
} from '@services';

export const getComments = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { postId } = req.query;

  try {
    const id = Number(postId);

    const comments = await commentService().getComments(id);

    next({ status: 200, payload: comments });
  } catch (err) {
    next(err);
  }
};
export const createComment = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const {
    postId,
    value,
    password = '',
    username = '익명',
  }: CommentCreateParamsDto = req.body;
  const user = req.user;

  try {
    const newComment = await commentService().createComment({
      postId,
      value,
      userId: user?.id || null,
      username: user?.username || username,
      password: user?.password || password,
      isAnonymous: !user,
    });

    const isAuthor = await postService().checkAuthor(postId, user?.id || '');

    if (!isAuthor) {
      const { id, userId, title } = await postService().exist(postId);

      await notificationService().createNotification({
        commentId: newComment.id,
        userId,
        postId: id,
      });
    }

    next({ status: 201, payload: null });
  } catch (err) {
    next(err);
  }
};
export const updateComment = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const {
    id,
    value,
    password = '',
    username = '익명',
  }: CommentUpdateParamsDto = req.body;

  const user = req.user;

  try {
    await commentService().updateComment({
      id,
      value,
      userId: user?.id || null,
      username: user?.username || username,
      password: user?.password || password,
      isAnonymous: !user,
    });

    next({ status: 200, payload: null });
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { id, password } = req.query;
  const userId = req.user?.id;

  try {
    await commentService().deleteComment(
      String(id),
      String(password),
      userId || ''
    );

    next({ status: 200, payload: null });
  } catch (err) {
    next(err);
  }
};

export const getCommentReplies = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { commentId } = req.body;

  try {
    const comment = await commentReplyService().getReplies(commentId);

    next({ status: 200, payload: comment });
  } catch (err) {
    next(err);
  }
};

export const createCommentReply = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const {
    commentId = '',
    postId,
    value,
    username = '익명',
    password = '',
  }: CommentReplyCreateParamsDto = req.body;
  const user = req.user;

  try {
    const comment = await commentService().exist(commentId);

    await commentReplyService().createReply({
      postId,
      value,
      userId: user?.id || null,
      username: user?.username || username,
      password: user?.password || password,
      isAnonymous: !user,
      commentId,
    });

    const isAuthor = await commentService().checkAuthor(
      commentId,
      user?.id || ''
    );

    if (!isAuthor) {
      await notificationService().createNotification({
        commentId: comment.id,
        userId: comment.userId,
        postId,
      });
    }

    next({ status: 201, payload: null });
  } catch (err) {
    next(err);
  }
};

export const updateCommentReply = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const {
    id,
    value,
    password = '',
    username = '익명',
  }: Omit<CommentUpdateParamsDto, 'postId'> = req.body;

  const user = req.user;

  try {
    await commentReplyService().updateReply({
      id,
      value,
      userId: user?.id || null,
      username: user?.username || username,
      password: user?.password || password,
      isAnonymous: !user,
    });

    next({ status: 200, payload: null });
  } catch (err) {
    next(err);
  }
};
export const deleteCommentReply = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { id, password } = req.query;
  const userId = req.user?.id;

  try {
    await commentReplyService().deleteReply(
      String(id),
      String(password),
      userId || ''
    );

    next({ status: 200, payload: null });
  } catch (err) {
    next(err);
  }
};
