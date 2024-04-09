import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { EmailService } from '../email/email.service';
import { LogRepository } from '../../domain/repository/log.repository';
import { LogEntity } from '../../domain/entities/log.entity';

/**
 * Class representing a consumer service for processing messages from a RabbitMQ queue.
 */
export class ConsumerService {
  private channelWrapper: ChannelWrapper | undefined = undefined;
  private EXCHANGE: string;

  /**
   * Creates an instance of ConsumerService.
   * @param {EmailService} emailService - The email service used for sending notifications.
   * @param {string} rabbitmqUrl - The URL of the RabbitMQ server.
   * @param {string} queue - The name of the queue to consume messages from.
   * @param {LogRepository[]} logRepository - An array of log repositories for saving log entities.
   */
  constructor(
    private emailService: EmailService,
    private readonly rabbitmqUrl: string,
    private readonly queue: string,
    private readonly logRepository: LogRepository[]
  ) {
    this.EXCHANGE = 'error-notification';
    try {
      const connection = amqp.connect(this.rabbitmqUrl);
      this.channelWrapper = connection.createChannel();
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Calls the saveLog method for each log repository.
   * @param log The log entity to be saved.
   */
  private callLogs(log: LogEntity) {
    this.logRepository.forEach((repository) => repository.saveLog(log));
  }

  /**
   * Consumes messages from the queue and processes them.
   */
  public async consume() {
    try {
      await this.channelWrapper!.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue(this.queue, { durable: true });
        await channel.bindQueue(this.queue, this.EXCHANGE, this.queue);
        await channel.consume(this.queue, async (message) => {
          if (message) {
            const content = JSON.parse(message.content.toString());

            const log = new LogEntity({
              message: content.message,
              level: content.level,
              origin: content.origin,
            });

            console.log({ log });

            this.callLogs(log);
            this.emailService.sendEmailWithFileSystemLogs('yusepah@gmail.com');
            this.emailService.sendEmailWithFileSystemLogs('paco.max@gmail.com');
            this.emailService.sendEmailWithFileSystemLogs('jmab2k@gmail.com');
            channel.ack(message);
          }
        });
      });
      console.log(
        `${this.queue} consumer service started and listening for messages`
      );
    } catch (err) {
      console.log('Error starting the consumer: ', err);
    }
  }
}
