import { LogEntity, LogSeverityLevel } from './log.entity';

describe('/domain/entities/log.entity.ts', () => {
  test('should create a LogEntity instance', () => {
    const newLog = new LogEntity({
      message: 'test-message',
      origin: 'log.entity.test.ts',
      level: LogSeverityLevel.low,
    });
    expect(newLog).toBeInstanceOf(LogEntity);
    expect(newLog.message).toBe('test-message');
    expect(newLog.level).toBe(LogSeverityLevel.low);
    expect(newLog.origin).toBe('log.entity.test.ts');
    expect(newLog.createdAt).toBeInstanceOf(Date);
  });

  test('should create a LogEntity instance from json', () => {
    const jsonLog = ` {
      "message":"Service https://google.com working","level":"low","origin":"check-service.ts","createdAt":"2023-12-03T11:44:35.554Z"
    }`;

    const log = LogEntity.fromJson(jsonLog);

    expect(log).toBeInstanceOf(LogEntity);
    expect(log.message).toBe('Service https://google.com working');
    expect(log.level).toBe(LogSeverityLevel.low);
    expect(log.origin).toBe('check-service.ts');
    expect(log.createdAt).toBeInstanceOf(Date);
  });

  test('should create a LogEntity instance from an object', () => {
    const objLog = {
      message: 'Service https://google.com working',
      level: 'low',
      origin: 'check-service.ts',
      createdAt: '2023-12-03T11:44:35.554Z',
    };

    const log = LogEntity.fromObject(objLog);

    expect(log).toBeInstanceOf(LogEntity);
    expect(log.message).toBe('Service https://google.com working');
    expect(log.level).toBe(LogSeverityLevel.low);
    expect(log.origin).toBe('check-service.ts');
    expect(log.createdAt).toBeInstanceOf(Date);
  });

  test('should return and undefined log if json is empty', () => {
    const emptyLog = '';

    const log = LogEntity.fromJson(emptyLog);

    console.log(log);

    expect(log).toEqual(
      expect.objectContaining({
        message: undefined,
        level: undefined,
        origin: undefined,
        createdAt: expect.anything(),
      })
    );
  });
});
