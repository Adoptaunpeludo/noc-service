import mongoose from 'mongoose';
import { envs } from '../../config/plugins/env.plugin';
import { LogModel, MongoDatabase } from '../../data/mongo';
import { MongoLogDataSource } from './mongo-log.datasource';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';

describe('infrastructure/datasources/mongo-log.datasource.ts', () => {
  beforeAll(async () => {
    await MongoDatabase.connect({
      dbName: envs.MONGO_DB_NAME,
      mongoUrl: envs.MONGO_URL,
    });
  });

  afterEach(async () => {
    await LogModel.deleteMany();
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  const logDataSource = new MongoLogDataSource();
  const log = new LogEntity({
    level: LogSeverityLevel.low,
    message: 'test message',
    origin: 'mongo-log.test.datasource.ts',
  });

  test('should create a log', async () => {
    const logSpy = jest.spyOn(console, 'log');

    await logDataSource.saveLog(log);

    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      'Mongo Log Created:',
      expect.any(String)
    );
  });

  test('should get logs', async () => {
    await logDataSource.saveLog(log);
    await logDataSource.saveLog(log);
    const logs = await logDataSource.getLogs(LogSeverityLevel.low);

    expect(logs.length).toBe(2);
    expect(logs[0].level).toBe(LogSeverityLevel.low);

    expect(logs[1]).toEqual(
      expect.objectContaining({
        createdAt: expect.any(Date),
        level: 'low',
        message: 'test message',
        origin: 'mongo-log.test.datasource.ts',
      })
    );
  });
});
