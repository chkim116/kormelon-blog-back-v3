import { EntityRepository, getCustomRepository, Repository } from 'typeorm';

import { env } from '@config';
import { Notification } from '@models';

import { NotificationCreateParamsDto } from './notification.dto';

export function notificationService() {
  return getCustomRepository(NotificationService, env.mode);
}

@EntityRepository(Notification)
class NotificationService extends Repository<Notification> {
  /**
   * 알림을 가져온다.
   *
   * @returns
   */
  async getNotifications(userId: string) {
    const notifications = await this.createQueryBuilder('notification')
      .where({
        userId,
      })
      .andWhere({ isRead: false })
      .select([
        'notification.id',
        'notification.postId',
        'notification.commentId',
        'notification.isRead',
        'notification.createdAt',
      ])
      .orderBy({ id: 'DESC' })
      .getMany();

    return notifications;
  }

  /**
   * 알림 생성
   *
   * comment 작성 -> 게시글 작성자에게 알림을 저장
   * commentReply 작성 -> 댓글 작성자에게 알림을 저장
   *
   * @param params
   */
  async createNotification(params: NotificationCreateParamsDto) {
    const notification = await this.create(params);

    await this.save(notification);
  }

  /**
   * 알림을 읽는다면, isRead를 처리한다.
   *
   * @param id
   */
  async readNotification(id: number, userId: string) {
    await this.check(id, userId);

    const notification = await this.exist(id);

    await this.update(id, { ...notification, isRead: true });
  }

  /**
   * 알림이 존재하는지 확인한다.
   *
   * @param id
   * @returns
   */
  async exist(id: number) {
    const exist = this.findOne({ where: { id } });

    if (!exist) {
      throw new Error('존재하지 않는 알림입니다.');
    }

    return exist;
  }

  /**
   * 지우는 알림이 해당 유저의 것인지 확인한다.
   *
   * @param id
   * @returns
   */
  private async check(id: number, userId: string) {
    const exist = await this.createQueryBuilder()
      .where({ id })
      .andWhere({ userId })
      .getCount();

    if (!exist) {
      throw new Error('해당 유저의 알림이 아닙니다.');
    }

    return Boolean(exist);
  }
}
