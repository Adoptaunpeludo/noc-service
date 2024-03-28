import { CronService } from './cron-service';
describe('presentation/cron', () => {
  const mockTick = jest.fn();

  test('should create a job', (done) => {
    // expect.assertions(1);

    const job = CronService.createJob('* * * * * *', mockTick);

    setTimeout(() => {
      expect(mockTick).toHaveBeenCalledTimes(2);
      job.stop();
      done();
    }, 2000);
  });
});
