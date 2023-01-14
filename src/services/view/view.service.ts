import { getCustomRepository, EntityRepository, Repository } from 'typeorm';

import { env } from '@config';

import View from '../../models/View';

export function viewService() {
  return getCustomRepository(ViewService, env.mode);
}

@EntityRepository(View)
class ViewService extends Repository<View> {
  async getView() {
    const [view] = await this.find();

    if (!view) {
      const newView = await this.save({ total: 0, today: 0, ips: [] });

      return newView;
    }

    return view;
  }

  async addView(newIp: string) {
    const [view] = await this.find();

    return await this.save({
      ...view,
      today: view.today + 1,
      ips: [...view.ips, newIp],
    });
  }

  async calculateView() {
    const [view] = await this.find();

    if (!view) {
      const newView = await this.save({ total: 0, today: 0, ips: [] });

      return newView;
    }

    return await this.save({
      ...view,
      total: view.total + view.today,
      today: 0,
      ips: [],
    });
  }
}
