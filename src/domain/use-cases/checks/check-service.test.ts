import { LogEntity } from '../../entities/log.entity';
import { CheckService } from './check-service';

describe('domain/use-cases/checks/check-service.ts', () => {
  const mockRepository = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };

  const successCallback = jest.fn();
  const errorCallback = jest.fn();

  const checkService = new CheckService(
    mockRepository,
    successCallback,
    errorCallback
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call successCallback when fetch returns true', async () => {
    const wasOk = await checkService.execute('https://google.com');

    expect(wasOk).toBe(true);
    expect(successCallback).toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();

    expect(mockRepository.saveLog).toHaveBeenCalledWith(expect.any(LogEntity));
  });

  test('should call errorCallback when fetch returns false', async () => {
    const wasOk = await checkService.execute('https://googlessef.com');

    expect(wasOk).toBe(false);
    expect(errorCallback).toHaveBeenCalled();
    expect(successCallback).not.toHaveBeenCalled();

    expect(mockRepository.saveLog).toHaveBeenCalledWith(expect.any(LogEntity));
  });

  test('should return an error', async () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock;
    const mockedErrorResponse = { ok: false };
    const mockedUrl = 'iuyfiuyfiuyg';
    fetchMock.mockResolvedValueOnce(mockedErrorResponse);
    const wasOk = await checkService.execute(mockedUrl);
    expect(wasOk).toBe(false);
  });
});
