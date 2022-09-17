import { Request, Response } from 'express';

import {
  CommentCreateParamsDto,
  CommentReplyCreateParamsDto,
  commentReplyService,
  commentService,
  CommentUpdateParamsDto,
} from '@services';

export const getComments = async (req: Request, res: Response) => {
  const { postId } = req.query;

  try {
    const id = Number(postId);

    const comments = await commentService().getComments(id);

    res.status(200).send({ status: 200, payload: comments });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};
export const createComment = async (req: Request, res: Response) => {
  const {
    postId,
    value,
    password = '',
    username = '익명',
  }: CommentCreateParamsDto = req.body;
  const user = req.user;

  try {
    await commentService().createComment({
      postId,
      value,
      userId: user?.id || null,
      username: user?.username || username,
      password: user?.password || password,
      isAnonymous: !user,
    });

    res.status(201).send({ status: 201, payload: null });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};
export const updateComment = async (req: Request, res: Response) => {
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

    res.status(200).send({ status: 200, payload: null });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const { id, password } = req.query;
  const userId = req.user?.id;

  try {
    await commentService().deleteComment(
      String(id),
      String(password),
      userId || ''
    );

    res.status(200).send({ status: 200, payload: null });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};

export const getCommentReplies = async (req: Request, res: Response) => {
  const { commentId } = req.body;

  try {
    const comment = await commentReplyService().getReplies(commentId);

    res.status(200).send({ status: 200, payload: comment });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};

export const createCommentReply = async (req: Request, res: Response) => {
  const {
    commentId = '',
    postId,
    value,
    username = '익명',
    password = '',
  }: CommentReplyCreateParamsDto = req.body;
  const user = req.user;

  try {
    await commentService().exist(commentId);

    await commentReplyService().createReply({
      postId,
      value,
      userId: user?.id || null,
      username: user?.username || username,
      password: user?.password || password,
      isAnonymous: !user,
      commentId,
    });
    res.status(201).send({ status: 201, payload: null });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};

export const updateCommentReply = async (req: Request, res: Response) => {
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

    res.status(200).send({ status: 200, payload: null });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};
export const deleteCommentReply = async (req: Request, res: Response) => {
  const { id, password } = req.query;
  const userId = req.user?.id;

  try {
    await commentReplyService().deleteReply(
      String(id),
      String(password),
      userId || ''
    );

    res.status(200).send({ status: 200, payload: null });
  } catch (err: any) {
    res.status(400).send({ status: 400, message: err.message });
  }
};
