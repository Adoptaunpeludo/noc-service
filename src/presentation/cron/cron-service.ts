import { CronJob } from 'cron';

type CronTime = string | Date;
type OnTick = () => void;

/**
 * Class for managing cron jobs.
 */
export class CronService {
  /**
   * Creates and starts a new cron job.
   * @param cronTime The cron time configuration for scheduling the job.
   * @param onTick The function to execute on each tick of the cron job.
   * @returns The created cron job instance.
   */
  static createJob(cronTime: CronTime, onTick: OnTick): CronJob {
    const job = new CronJob(cronTime, onTick);

    job.start();

    return job;
  }
}
