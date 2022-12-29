import { EntityRepository, getCustomRepository, Repository } from 'typeorm';

import { env } from '@config';
import { Comment, CommentReply } from '@models';
import bcrypt from 'bcrypt';

import {
  CommentCreateParamsEntity,
  CommentReplyCreateParamsEntity,
  CommentUpdateParamsEntity,
} from './comment.dto';

function timestamp() {
  const today = new Date();
  today.setHours(today.getHours() + 9);
  return today.toISOString().replace('T', ' ').substring(0, 19);
}

export function commentService() {
  return getCustomRepository(CommentService, env.mode);
}

export function commentReplyService() {
  return getCustomRepository(CommentReplyService, env.mode);
}

@EntityRepository(Comment)
class CommentService extends Repository<Comment> {
  /**
   * 게시글 id에 따라 댓글을 조회한다.
   *
   * @param postId
   * @returns
   */
  async getComments(postId: number) {
    const comments = await this.createQueryBuilder('comment')
      .where('comment.postId = :postId', { postId })
      .select([
        'comment.id',
        'comment.value',
        'comment.username',
        'comment.userId',
        'comment.isAnonymous',
        'comment.createdAt',
        'comment.deletedAt',
      ])
      .leftJoin('comment.user', 'user')
      .addSelect(['user.profileImage'])
      .withDeleted()
      .leftJoin('comment.commentReplies', 'reply')
      .addSelect([
        'reply.id',
        'reply.value',
        'reply.username',
        'reply.userId',
        'reply.isAnonymous',
        'reply.createdAt',
        'reply.deletedAt',
      ])
      .leftJoin('reply.user', 'replyUser')
      .addSelect(['replyUser.profileImage'])
      .orderBy({ 'reply.createdAt': 'DESC' })
      .orderBy({ 'comment.createdAt': 'DESC' })
      .getMany();

    return comments;
  }

  /**
   * 댓글을 생성한다.
   */
  async createComment(params: CommentCreateParamsEntity) {
    const salt = await bcrypt.genSalt(5);
    const hashPassword = await bcrypt.hash(params.password, salt);

    const comment = await this.create({
      ...params,
      password: hashPassword,
    });

    return await this.save(comment);
  }

  /**
   * 댓글을 수정한다.
   *
   * @param param0
   */
  async updateComment({ id, ...params }: CommentUpdateParamsEntity) {
    const comment = await this.exist(id);

    if (comment.isAnonymous) {
      const isPasswordCorrect = await bcrypt.compare(
        params.password || '',
        comment.password
      );

      if (!isPasswordCorrect) {
        throw new Error('비밀번호가 틀립니다.');
      }

      params.password = comment.password;

      await this.update(id, { ...comment, ...params });
      return;
    }

    if (comment.userId !== params.userId) {
      throw new Error('댓글을 작성한 유저가 아닙니다.');
    }

    params.password = comment.password;

    await this.update(id, { ...comment, ...params });
    return;
  }

  /**
   * 댓글을 삭제한다.
   *
   * @param id
   * @param password
   * @param userId
   */
  async deleteComment(id: string, password: string, userId: string) {
    const comment = await this.exist(id);

    if (comment.isAnonymous) {
      const isPasswordCorrect = await bcrypt.compare(
        password || '',
        comment.password
      );

      if (!isPasswordCorrect) {
        throw new Error('비밀번호가 틀립니다.');
      }

      await this.update(id, {
        value: '삭제된 댓글입니다.',
        password: comment.password,
        deletedAt: timestamp(),
      });

      return;
    }

    if (comment.userId !== userId) {
      throw new Error('댓글을 작성한 유저가 아닙니다.');
    }

    await this.update(id, {
      value: '삭제된 댓글입니다.',
      password: comment.password,
      deletedAt: timestamp(),
    });
  }

  /**
   * 댓긇이 존재하는지 확인한다.
   *
   * @param id
   * @returns
   */
  async exist(id: string) {
    const exist = await this.findOne({
      where: { id },
      select: ['isAnonymous', 'password', 'username', 'userId', 'id'],
    });

    if (!exist) {
      throw new Error('존재하지 않는 댓글입니다.');
    }

    return exist;
  }

  /**
   * 현재 유저가 특정 댓글의 작성자인지 확인한다.
   *
   * @param commentId
   * @param userId
   * @returns
   */
  async checkAuthor(commentId: string, userId: string) {
    const exist = await this.createQueryBuilder('comment')
      .where({ id: commentId })
      .andWhere({ userId })
      .getCount();

    return Boolean(exist);
  }
}

@EntityRepository(CommentReply)
class CommentReplyService extends Repository<CommentReply> {
  /**
   * 댓글의 하위 댓글을 가져온다.
   *
   * @param commentId
   * @returns
   */
  async getReplies(commentId: string) {
    const comments = await this.createQueryBuilder('reply')
      .where('reply.commentId = :commentId', { commentId })
      .select([
        'reply.id',
        'reply.value',
        'reply.username',
        'reply.userId',
        'reply.isAnonymous',
        'reply.createdAt',
        'reply.deletedAt',
      ])
      .orderBy({ 'reply.createdAt': 'DESC' })
      .getMany();

    return comments;
  }

  /**
   * 대댓글 생성
   *
   * @param params
   */
  async createReply(params: CommentReplyCreateParamsEntity) {
    const salt = await bcrypt.genSalt(5);
    const hashPassword = await bcrypt.hash(params.password, salt);

    const reply = await this.create({
      ...params,
      password: hashPassword,
    });

    await this.save(reply);
  }

  /**
   * 대댓글 수정
   *
   * 댓글 수정 로직과 흡사하다.
   *
   * @param param0
   * @returns
   */
  async updateReply({
    id,
    ...params
  }: Omit<CommentUpdateParamsEntity, 'postId'>) {
    const reply = await this.exist(id);

    if (reply.isAnonymous) {
      const isPasswordCorrect = await bcrypt.compare(
        params.password || '',
        reply.password
      );

      if (!isPasswordCorrect) {
        throw new Error('비밀번호가 틀립니다.');
      }

      params.password = reply.password;

      await this.update(id, { ...reply, ...params });
      return;
    }

    if (reply.userId !== params.userId) {
      throw new Error('댓글을 작성한 유저가 아닙니다.');
    }

    params.password = reply.password;

    await this.update(id, { ...reply, ...params });
    return;
  }

  /**
   * 대댓글 삭제
   *
   * @param id
   * @param password
   * @param userId
   * @returns
   */
  async deleteReply(id: string, password: string, userId: string) {
    const reply = await this.exist(id);

    if (reply.isAnonymous) {
      const isPasswordCorrect = await bcrypt.compare(
        password || '',
        reply.password
      );

      if (!isPasswordCorrect) {
        throw new Error('비밀번호가 틀립니다.');
      }

      await this.delete(id);
      return;
    }

    if (reply.userId !== userId) {
      throw new Error('댓글을 작성한 유저가 아닙니다.');
    }

    await this.delete(id);
  }

  /**
   * 대댓글이 존재하는지 확인한다.
   *
   * @param id
   * @returns
   */
  async exist(id: string) {
    const exist = await this.findOne({
      where: { id },
      select: ['isAnonymous', 'password', 'username', 'userId', 'id'],
    });

    if (!exist) {
      throw new Error('존재하지 않는 댓글입니다.');
    }

    return exist;
  }
}
