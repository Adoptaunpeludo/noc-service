import { EmailService } from '../../../presentation/email/email.service';
import { LogEntity } from '../../entities/log.entity';
import { SendEmailLogs } from './send-email-logs';
describe('domain/use-cases/email/send-email-logs.ts', () => {
  const mockEmailService = {
    sendEmailWithFileSystemLogs: jest.fn().mockReturnValue(true),
  };

  const mockRepository = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };
  const sendEmailLogs = new SendEmailLogs(
    mockEmailService as any,
    mockRepository
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call sendEmail and saveLog', async () => {
    const result = await sendEmailLogs.execute('test@test.com');

    expect(result).toBe(true);
    expect(mockEmailService.sendEmailWithFileSystemLogs).toHaveBeenCalledWith(
      'test@test.com'
    );
    expect(mockRepository.saveLog).toHaveBeenCalledWith(expect.any(LogEntity));
    expect(mockRepository.saveLog).toHaveBeenCalledWith(
      expect.objectContaining({
        createdAt: expect.any(Date),
        level: 'low',
        message: 'Log email sent',
        origin: 'send-email-log.ts',
      })
    );
  });

  test('should log in case of error', async () => {
    mockEmailService.sendEmailWithFileSystemLogs.mockResolvedValue(false);

    const result = await sendEmailLogs.execute('test@test.com');

    expect(result).toBe(false);
    expect(mockEmailService.sendEmailWithFileSystemLogs).toHaveBeenCalledWith(
      'test@test.com'
    );
    expect(mockRepository.saveLog).toHaveBeenCalledWith(expect.any(LogEntity));
    expect(mockRepository.saveLog).toHaveBeenCalledWith(
      expect.objectContaining({
        createdAt: expect.any(Date),
        level: 'high',
        message: 'Error: Email log not sent',
        origin: 'send-email-logs.ts',
      })
    );
  });
});
