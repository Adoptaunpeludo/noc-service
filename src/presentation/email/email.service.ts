import nodemailer from 'nodemailer';
import { envs } from '../../config/plugins/env.plugin';
import { LogRepository } from '../../domain/repository/log.repository';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachment[];
}

export interface Attachment {
  filename: string;
  path: string;
}

/**
 * Service class for sending emails.
 */
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: envs.MAILER_SERVICE,
    auth: {
      user: envs.MAILER_EMAIL,
      pass: envs.MAILER_SECRET_KEY,
    },
  });

  constructor() {}

  /**
   * Sends an email with the provided options.
   * @param options The options for sending the email.
   * @returns A promise that resolves to a boolean indicating if the email was sent successfully.
   */
  async sendEmail(options: SendMailOptions): Promise<boolean> {
    const { to, subject, htmlBody, attachments = [] } = options;

    try {
      const sentInformation = await this.transporter.sendMail({
        to,
        subject,
        attachments,
        html: htmlBody,
      });
      // console.log(sentInformation)

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Sends an email with system logs attached as files.
   * @param to The recipient(s) of the email.
   * @returns A promise that resolves to a boolean indicating if the email was sent successfully.
   */
  sendEmailWithFileSystemLogs(to: string | string[]) {
    const subject = 'Server Logs';
    const htmlBody = `
      <h3>NOC - System Logs</h3>
      <p>See Attached Files</p>
    `;

    const attachments: Attachment[] = [
      { filename: 'logs-all.log', path: './logs/logs-all.log' },
      { filename: 'logs-high.log', path: './logs/logs-high.log' },
      { filename: 'logs-medium.log', path: './logs/logs-medium.log' },
    ];

    return this.sendEmail({
      to,
      subject,
      attachments,
      htmlBody,
    });
  }
}
