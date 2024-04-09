import { EmailService } from '../../../presentation/email/email.service';
import { LogEntity, LogSeverityLevel } from '../../entities/log.entity';
import { LogRepository } from '../../repository/log.repository';

/**
 * Interface for the use case of sending log emails.
 */
interface SendLogEmailUseCase {
  /**
   * Executes the sending of log emails.
   * @param to The email address or addresses to send the log emails to.
   * @returns A promise that resolves to true if the log emails are sent successfully, otherwise false.
   */
  execute: (to: string | string[]) => Promise<boolean>;
}

/**
 * Class representing the use case of sending log emails.
 */
export class SendEmailLogs implements SendLogEmailUseCase {
  /**
   * Creates an instance of SendEmailLogs.
   * @param emailService The email service used to send log emails.
   * @param logRepository The repository for saving logs.
   */
  constructor(
    private readonly emailService: EmailService,
    private readonly logRepository: LogRepository
  ) {}

  /**
   * Executes the sending of log emails.
   * @param to The email address or addresses to send the log emails to.
   * @returns A promise that resolves to true if the log emails are sent successfully, otherwise false.
   */
  async execute(to: string | string[]) {
    try {
      const sent = await this.emailService.sendEmailWithFileSystemLogs(to);
      if (!sent) throw new Error('Email log not sent');

      const log = new LogEntity({
        message: 'Log email sent',
        level: LogSeverityLevel.low,
        origin: 'send-email-log.ts',
      });

      this.logRepository.saveLog(log);
      return true;
    } catch (error) {
      const log = new LogEntity({
        message: `${error}`,
        level: LogSeverityLevel.high,
        origin: 'send-email-logs.ts',
      });
      this.logRepository.saveLog(log);
      return false;
    }
  }
}
