import { FileSystemDatasource } from '../infrastructure/datasources/file-system.datasource';
import { LogRepositoryImpl } from '../infrastructure/repositories/log.repository.implementation';
import { CronService } from './cron/cron-service';
import { CheckService } from '../domain/use-cases/checks/check-service';
import { EmailService } from './email/email.service';
import { SendEmailLogs } from '../domain/use-cases/email/send-email-logs';
import { MongoLogDataSource } from '../infrastructure/datasources/mongo-log.datasource';
import { PostgreSQLLogDatasource } from '../infrastructure/datasources/postgresql-log.datasource';
import { LogSeverityLevel } from '../domain/entities/log.entity';
import { CheckServiceMultiple } from '../domain/use-cases/checks/check-service-multiple';
import { ConsumerService } from './consumer/consumer.service';
import { envs } from '../config/plugins/env.plugin';

const fileSystemLogRepository = new LogRepositoryImpl(
  new FileSystemDatasource()
);
const mongoLogRepository = new LogRepositoryImpl(new MongoLogDataSource());
const postgreLogRepository = new LogRepositoryImpl(
  new PostgreSQLLogDatasource()
);
const emailService = new EmailService();

export class Server {
  public static async start() {
    console.log('Server started...');

    // Schedule cron job to check service status
    CronService.createJob('1 * * * *', () => {
      const url = 'https://www.adoptaunpeludo.com';
      new CheckServiceMultiple(
        emailService,
        [fileSystemLogRepository, mongoLogRepository],
        () => console.log(`${url} is ok`),
        (error) => console.log(error)
      ).execute(url);
    });

    // Initialize error notification service
    const errorNotificationService = new ConsumerService(
      emailService,
      envs.RABBITMQ_URL,
      'error-logs',
      [fileSystemLogRepository, mongoLogRepository]
    );

    // Start consuming messages for error notification
    await errorNotificationService.consume();
    // const logs = await logRepository.getLogs(LogSeverityLevel.high);
    // console.log(logs);

    //Mandar email
    // const emailService = new EmailService();
    // emailService.sendEmail({
    //   to: 'yusepah@gmail.com',
    //   subject: 'Logs de Sistema',
    //   htmlBody: `
    //     <h3>Logs de sistema - NOC</h3>
    //     <p>Ver logs adjuntos</p>
    //   `,
    // });

    // Mandar mail con system logs
    // emailService.sendEmailWithFileSystemLogs('yusepah@gmail.com');
    // new SendEmailLogs(emailService, fileSystemLogRepository).execute(
    //   'yusepah@gmail.com'
    // );

    // CronService.createJob('*/5 * * * * *', () => {
    //   const url = 'https://www.adoptaunpeludo.com';
    //   new CheckService(
    //     emailService,
    //     mongoLogRepository,
    //     () => console.log(`${url} is ok`),
    //     (error) => console.log(error)
    //   ).execute(url);
    // });
  }
}
