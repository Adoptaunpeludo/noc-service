import { LogRepositoryImpl } from './log.repository.implementation';
import { LogRepository } from '../../domain/repository/log.repository';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';
describe('infrastructure/repositories/log.repository.implementation', () => {
  const mockLogDataSource = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('saveLog should call the datasource', async () => {
    const logRepository = new LogRepositoryImpl(mockLogDataSource);

    const log = new LogEntity({
      level: LogSeverityLevel.low,
      message: 'test message',
      origin: 'log.repository.implementation.ts',
    });

    await logRepository.saveLog(log);

    expect(mockLogDataSource.saveLog).toHaveBeenCalled();
    expect(mockLogDataSource.saveLog).toHaveBeenCalledTimes(1);
    expect(mockLogDataSource.saveLog).toHaveBeenCalledWith(log);
  });

  test('getLogs should call the datasource', async () => {
    const logRepository = new LogRepositoryImpl(mockLogDataSource);

    const log = new LogEntity({
      level: LogSeverityLevel.low,
      message: 'test message',
      origin: 'log.repository.implementation.ts',
    });

    await logRepository.saveLog(log);

    const logs = await logRepository.getLogs(LogSeverityLevel.low);

    expect(mockLogDataSource.getLogs).toHaveBeenCalled();
    expect(mockLogDataSource.getLogs).toHaveBeenCalledTimes(1);
    expect(mockLogDataSource.getLogs).toHaveBeenCalledWith(
      LogSeverityLevel.low
    );
  });
});
