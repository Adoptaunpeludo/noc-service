import { EmailService } from '../../../presentation/email/email.service';
import { LogEntity, LogSeverityLevel } from '../../entities/log.entity';
import { LogRepository } from '../../repository/log.repository';

/**
 * Class for the use case of checking multiple services.
 */
interface CheckServiceMultipleUseCase {
  /**
   * Executes the check service operation.
   * @param url The URL of the service to check.
   * @returns A promise that resolves to true if the service is reachable, otherwise false.
   */
  execute(url: string): Promise<boolean>;
}

/**
 * Type definition for a success callback function.
 */
type SuccessCallback = (() => void) | undefined;

/**
 * Type definition for an error callback function.
 */
type ErrorCallback = ((error: string) => void) | undefined;

/**
 * Class representing the use case of checking multiple services.
 */
export class CheckServiceMultiple implements CheckServiceMultipleUseCase {
  private name = 'check-service.ts';

  /**
   * Creates an instance of CheckServiceMultiple.
   * @param emailService The email service used to send notifications.
   * @param logRepository The repository for saving logs.
   * @param successCallback Callback function to execute on success.
   * @param errorCallback Callback function to execute on error.
   */
  constructor(
    private readonly emailService: EmailService,
    private readonly logRepository: LogRepository[],
    private readonly successCallback: SuccessCallback,
    private readonly errorCallback: ErrorCallback
  ) {}

  /**
   * Calls the log repository to save a log entity.
   * @param log The log entity to save.
   */
  private callLogs(log: LogEntity) {
    this.logRepository.forEach((repository) => repository.saveLog(log));
  }

  /**
   * Executes the check service operation.
   * @param url The URL of the service to check.
   * @returns A promise that resolves to true if the service is reachable, otherwise false.
   */
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
