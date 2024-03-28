import { CheckServiceMultiple } from './check-service-multiple';
import { LogEntity } from '../../entities/log.entity';

describe('domain/use-cases/checks/check-service.ts', () => {
  const mockRepositoryFs = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };
  const mockRepositoryMongo = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };
  const mockRepositoryPostgre = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };

  const successCallback = jest.fn();
  const errorCallback = jest.fn();

  const checkServiceMultiple = new CheckServiceMultiple(
    [mockRepositoryFs, mockRepositoryMongo, mockRepositoryPostgre],
    successCallback,
    errorCallback
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call successCallback when fetch returns true', async () => {
    const wasOk = await checkServiceMultiple.execute('https://google.com');

    expect(wasOk).toBe(true);
    expect(successCallback).toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();

    expect(mockRepositoryFs.saveLog).toHaveBeenCalledWith(
      expect.any(LogEntity)
    );
    expect(mockRepositoryMongo.saveLog).toHaveBeenCalledWith(
      expect.any(LogEntity)
    );
    expect(mockRepositoryPostgre.saveLog).toHaveBeenCalledWith(
      expect.any(LogEntity)
    );
  });

  test('should call errorCallback when fetch returns false', async () => {
    const wasOk = await checkServiceMultiple.execute('https://googlessef.com');

    expect(wasOk).toBe(false);
    expect(errorCallback).toHaveBeenCalled();
    expect(successCallback).not.toHaveBeenCalled();

    expect(mockRepositoryFs.saveLog).toHaveBeenCalledWith(
      expect.any(LogEntity)
    );
    expect(mockRepositoryMongo.saveLog).toHaveBeenCalledWith(
      expect.any(LogEntity)
    );
    expect(mockRepositoryPostgre.saveLog).toHaveBeenCalledWith(
      expect.any(LogEntity)
    );
  });

  test('should return an error', async () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock;
    const mockedErrorResponse = { ok: false };
    const mockedUrl = 'iuyfiuyfiuyg';
    fetchMock.mockResolvedValueOnce(mockedErrorResponse);
    const wasOk = await checkServiceMultiple.execute(mockedUrl);
    expect(wasOk).toBe(false);
  });
});
