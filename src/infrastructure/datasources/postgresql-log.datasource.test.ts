import { PrismaClient } from '@prisma/client';
import { LogDatasource } from '../../domain/datasources/log.datasource';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';
import { PostgreSQLLogDatasource } from './postgresql-log.datasource';
describe('infrastructure/datasources/postgresql-log.datasource.ts', () => {
  const logDatasource = new PostgreSQLLogDatasource();

  const prisma = new PrismaClient();

  afterEach(async () => {
    await prisma.logModel.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const log = new LogEntity({
    level: LogSeverityLevel.medium,
    message: 'test log',
    origin: 'postgresql-log.datasource.test.ts',
  });
  test('should save a log', async () => {
    const logSpy = jest.spyOn(console, 'log');

    await logDatasource.saveLog(log);

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(
      'Postgre Log Created:',
      expect.any(Number)
    );
  });

  test('should get all logs', async () => {
    await logDatasource.saveLog(log);
    const logs = await logDatasource.getLogs(LogSeverityLevel.medium);

    expect(logs.length).toBe(1);

    expect(logs[0]).toEqual(
      expect.objectContaining({
        createdAt: expect.any(Date),
        level: 'MEDIUM',
        message: 'test log',
        origin: 'postgresql-log.datasource.test.ts',
      })
    );
  });

  test('should correctly convert severity level', () => {
    const severityLevelFn = logDatasource['__test__'].getSeverityLevel;

    expect(severityLevelFn('low')).toBe('LOW');
    expect(severityLevelFn('medium')).toBe('MEDIUM');
    expect(severityLevelFn('high')).toBe('HIGH');
  });
});
