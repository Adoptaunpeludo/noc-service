import fs from 'fs';
import path from 'path';
import { FileSystemDatasource } from './file-system.datasource';
import { LogDatasource } from '../../domain/datasources/log.datasource';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';
describe('infrastructure/datasources/file-system.datasource.ts', () => {
  const logPath = path.join(__dirname, '../../../logs');

  const log = new LogEntity({
    level: LogSeverityLevel.low,
    message: 'test log',
    origin: 'file-system.datasource.test.ts',
  });

  beforeEach(() => {
    fs.rmSync(logPath, { recursive: true, force: true });
  });

  test('should create log files if they do not exists', () => {
    new FileSystemDatasource();

    const files = fs.readdirSync(logPath);

    expect(files.length).toBe(3);
    expect(files).toEqual(['logs-all.log', 'logs-high.log', 'logs-medium.log']);
  });

  test('should save a log in logs-all.log', () => {
    const logDatasource = new FileSystemDatasource();

    logDatasource.saveLog(log);

    // const filePath = path.join(logPath, 'logs-all.log');
    const filePath = logPath + '/logs-all.log';

    const fileContent = fs.readFileSync(filePath, 'utf8');

    const fileExist = fs.existsSync(filePath);

    expect(fileExist).toBeTruthy();
    expect(fileContent).toContain(JSON.stringify(log));
    expect(JSON.parse(fileContent)).toEqual(
      expect.objectContaining({
        message: 'test log',
        level: 'low',
        origin: 'file-system.datasource.test.ts',
        createdAt: expect.any(String),
      })
    );
  });
  test('should save a log in logs-all.log and medium', () => {
    const logDatasource = new FileSystemDatasource();

    log.level = LogSeverityLevel.medium;

    logDatasource.saveLog(log);

    // const filePath = path.join(logPath, 'logs-all.log');
    const allFilePath = logPath + '/logs-all.log';
    const mediumFilePath = logPath + '/logs-medium.log';

    const allFileContent = fs.readFileSync(allFilePath, 'utf8');
    const mediumFileContent = fs.readFileSync(mediumFilePath, 'utf8');

    const allFileExist = fs.existsSync(allFilePath);
    const mediumFileExist = fs.existsSync(mediumFilePath);

    expect(allFileExist).toBeTruthy();
    expect(mediumFileExist).toBeTruthy();

    expect(allFileContent).toContain(JSON.stringify(log));
    expect(JSON.parse(allFileContent)).toEqual(
      expect.objectContaining({
        message: 'test log',
        level: 'medium',
        origin: 'file-system.datasource.test.ts',
        createdAt: expect.any(String),
      })
    );
    expect(mediumFileContent).toContain(JSON.stringify(log));
    expect(JSON.parse(mediumFileContent)).toEqual(
      expect.objectContaining({
        message: 'test log',
        level: 'medium',
        origin: 'file-system.datasource.test.ts',
        createdAt: expect.any(String),
      })
    );
  });

  test('should save a log in logs-all.log and high', () => {
    const logDatasource = new FileSystemDatasource();

    log.level = LogSeverityLevel.high;

    logDatasource.saveLog(log);

    // const filePath = path.join(logPath, 'logs-all.log');
    const allFilePath = logPath + '/logs-all.log';
    const highFilePath = logPath + '/logs-high.log';

    const allFileContent = fs.readFileSync(allFilePath, 'utf8');
    const highFileContent = fs.readFileSync(highFilePath, 'utf8');

    const allFileExist = fs.existsSync(allFilePath);
    const highFileExist = fs.existsSync(highFilePath);

    expect(allFileExist).toBeTruthy();
    expect(highFileExist).toBeTruthy();

    expect(allFileContent).toContain(JSON.stringify(log));
    expect(JSON.parse(allFileContent)).toEqual(
      expect.objectContaining({
        message: 'test log',
        level: 'high',
        origin: 'file-system.datasource.test.ts',
        createdAt: expect.any(String),
      })
    );
    expect(highFileContent).toContain(JSON.stringify(log));
    expect(JSON.parse(highFileContent)).toEqual(
      expect.objectContaining({
        message: 'test log',
        level: 'high',
        origin: 'file-system.datasource.test.ts',
        createdAt: expect.any(String),
      })
    );
  });

  test('should return all logs', async () => {
    const logDatasource = new FileSystemDatasource();

    const logLow = new LogEntity({
      level: LogSeverityLevel.low,
      message: 'test log-low',
      origin: 'file-system.datasource.test.ts',
    });
    const logMedium = new LogEntity({
      level: LogSeverityLevel.medium,
      message: 'test log-medium',
      origin: 'file-system.datasource.test.ts',
    });
    const logHigh = new LogEntity({
      level: LogSeverityLevel.high,
      message: 'test log-high',
      origin: 'file-system.datasource.test.ts',
    });

    await logDatasource.saveLog(logLow);
    await logDatasource.saveLog(logMedium);
    await logDatasource.saveLog(logHigh);

    const logsLow = await logDatasource.getLogs(LogSeverityLevel.low);
    const logsMedium = await logDatasource.getLogs(LogSeverityLevel.medium);
    const logsHigh = await logDatasource.getLogs(LogSeverityLevel.high);

    expect(logsLow).toEqual(
      expect.arrayContaining([logLow, logMedium, logHigh])
    );
    expect(logsMedium).toEqual(expect.arrayContaining([logMedium]));
    expect(logsHigh).toEqual(expect.arrayContaining([logHigh]));
  });

  test('should return an error if severity level is not implemented', async () => {
    const logDatasource = new FileSystemDatasource();
    await expect(logDatasource.getLogs(LogSeverityLevel.test)).rejects.toThrow(
      `${LogSeverityLevel.test} not implemented`
    );
  });

  test('should not throw an error if path exists', () => {
    new FileSystemDatasource();
    new FileSystemDatasource();

    expect(true).toBeTruthy();
  });

  test('should not throw an error if path exists', async () => {
    const logDataSource = new FileSystemDatasource();

    const logs = await logDataSource.getLogs(LogSeverityLevel.medium);

    expect(logs.length).toBe(0);
  });
});
