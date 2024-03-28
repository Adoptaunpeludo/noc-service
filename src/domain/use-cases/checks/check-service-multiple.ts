import { EmailService } from '../../../presentation/email/email.service';
import { LogEntity, LogSeverityLevel } from '../../entities/log.entity';
import { LogRepository } from '../../repository/log.repository';

interface CheckServiceMultipleUseCase {
  execute(url: string): Promise<boolean>;
}

type SuccessCallback = (() => void) | undefined;
type ErrorCallback = ((error: string) => void) | undefined;

export class CheckServiceMultiple implements CheckServiceMultipleUseCase {
  private name = 'check-service.ts';

  constructor(
    private readonly emailService: EmailService,
    private readonly logRepository: LogRepository[],
    private readonly successCallback: SuccessCallback,
    private readonly errorCallback: ErrorCallback
  ) {}

  private callLogs(log: LogEntity) {
    this.logRepository.forEach((repository) => repository.saveLog(log));
  }

  public async execute(url: string): Promise<boolean> {
    try {
      const req = await fetch(url);
      if (!req.ok) throw new Error(`Error on check service ${url}`);
      const log = new LogEntity({
        message: `Service ${url} working`,
        level: LogSeverityLevel.low,
        origin: this.name,
      });

      this.callLogs(log);
      // this.logRepository.saveLog(log);
      this.successCallback && this.successCallback();
      return true;
    } catch (error) {
      const errorMsg = `${url} is not ok. ${error}`;
      const log = new LogEntity({
        message: errorMsg,
        level: LogSeverityLevel.high,
        origin: this.name,
      });

      this.callLogs(log);
      this.emailService.sendEmailWithFileSystemLogs('yusepah@gmail.com');
      this.emailService.sendEmailWithFileSystemLogs('paco.max@gmail.com');
      this.emailService.sendEmailWithFileSystemLogs('jmab2k@gmail.com');

      // this.logRepository.saveLog(log);
      this.errorCallback && this.errorCallback(errorMsg);
      return false;
    }
  }
}
