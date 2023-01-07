import type { Express } from 'express';

import { cron } from './cron';
import { expressConfig } from './expressConfig';
import { mysqlLoader } from './mysql';

export default async (app: Express) => {
  await mysqlLoader();

  await expressConfig(app);

  // job
  cron();
};
