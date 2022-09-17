import { Repository } from 'typeorm';

import { Comment, CommentReply } from '@models';

import { CommentCreateParams, CommentUpdateParams } from './comment.dto';

export class CommentService {
  constructor(
    private CommentService: Repository<Comment>,
    private CommentReplyService: Repository<CommentReply>
  ) {}

  async create(params: CommentCreateParams) {
    const comment = await this.CommentService.create(params);

    await this.CommentService.save(comment);
  }

  async update({ id, ...params }: CommentUpdateParams) {
    await this.CommentService.update(id, params);
  }

  async delete(id: string) {
    await this.CommentService.delete(id);
  }

  async createReply(id: string, params: CommentCreateParams) {
    const commentReply = await this.CommentReplyService.create({
      ...params,
      commentId: id,
    });

    await this.CommentReplyService.save(commentReply);
  }

  async updateReply({ id, ...params }: CommentUpdateParams) {
    await this.CommentReplyService.update(id, params);
  }

  async deleteReply(id: string) {
    await this.CommentReplyService.delete(id);
  }
}
