import { EntityRepository, getCustomRepository, Repository } from 'typeorm';

import { randomUUID } from 'crypto';

import { env } from '@config';
import { Comment, CommentReply } from '@models';
import bcrypt from 'bcrypt';

import {
  CommentCreateParamsDto,
  CommentCreateParamsEntity,
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
      .leftJoin('comment.commentReplies', 'reply')
      .addSelect(['reply.id'])
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

    await this.save(comment);
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
      select: ['isAnonymous', 'password', 'username', 'userId'],
    });

    if (!exist) {
      throw new Error('존재하지 않는 댓글입니다.');
    }

    return exist;
  }
}

@EntityRepository(CommentReply)
class CommentReplyService extends Repository<CommentReply> {
  async createReply(id: string, params: CommentCreateParamsDto) {
    const commentReply = await this.create({
      ...params,
      commentId: id,
    });

    await this.save(commentReply);
  }

  async updateReply({ id, ...params }: CommentUpdateParamsEntity) {
    await this.update(id, params);
  }

  async deleteReply(id: string) {
    await this.delete(id);
  }
}
