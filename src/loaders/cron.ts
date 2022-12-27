import schedule from 'node-schedule';
import { cronCalculateView } from 'src/api/controller';

export async function cron() {
  schedule.scheduleJob('0 0 0 * * *', cronCalculateView);
}
