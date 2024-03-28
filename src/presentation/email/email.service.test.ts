import { SendMailOptions } from './email.service';
import { EmailService } from './email.service';
import nodemailer from 'nodemailer';
describe('presentation/email/email.service.ts', () => {
  const mockSendMail = jest.fn();

  nodemailer.createTransport = jest
    .fn()
    .mockReturnValue({ sendMail: mockSendMail });

  test('should send email', async () => {
    const emailService = new EmailService();

    const options: SendMailOptions = {
      to: 'yusepah@gmail.com',
      subject: 'Test',
      htmlBody: '<h1>Test</h1>',
    };

    const emailSent = await emailService.sendEmail(options);

    expect(emailSent).toBe(true);

    expect(mockSendMail).toHaveBeenCalledWith({
      attachments: expect.any(Array),
      html: '<h1>Test</h1>',
      subject: 'Test',
      to: 'yusepah@gmail.com',
    });
  });

  test('should send email with attachments', async () => {
    const emailService = new EmailService();
    await emailService.sendEmailWithFileSystemLogs('yusepah@gmail.com');

    expect(mockSendMail).toHaveBeenCalledWith({
      html: expect.any(String),
      subject: 'Server Logs',
      to: 'yusepah@gmail.com',
      attachments: expect.arrayContaining([
        { filename: 'logs-all.log', path: './logs/logs-all.log' },
        { filename: 'logs-high.log', path: './logs/logs-high.log' },
        { filename: 'logs-medium.log', path: './logs/logs-medium.log' },
      ]),
    });
  });

  test('should return false if an error occurred', async () => {
    const emailService = new EmailService();
    emailService.sendEmail = jest.fn().mockReturnValue(false);
    const options: SendMailOptions = {
      to: 'yusepah@gmail.com',
      subject: 'Test',
      htmlBody: '<h1>Test</h1>',
    };

    const emailSent = await emailService.sendEmail(options);

    expect(emailSent).toBe(false);
    expect(emailService.sendEmail).toHaveBeenCalledWith(options);
  });
});
