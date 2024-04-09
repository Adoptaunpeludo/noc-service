import { LogDatasource } from '../../domain/datasources/log.datasource';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';
import fs from 'fs';

/**
 * Data source class for managing logs stored in the file system.
 */
export class FileSystemDatasource implements LogDatasource {
  private readonly logPath = 'logs/';
  private readonly allLogsPath = 'logs/logs-all.log';
  private readonly mediumLogsPath = 'logs/logs-medium.log';
  private readonly highLogsPath = 'logs/logs-high.log';

  constructor() {
    this.createLogsFiles();
  }

  /**
   * Creates log files if they do not exist.
   */
  private createLogsFiles = () => {
    if (!fs.existsSync(this.logPath)) {
      fs.mkdirSync(this.logPath);
    }

    [this.allLogsPath, this.mediumLogsPath, this.highLogsPath].forEach(
      (path) => {
        if (fs.existsSync(path)) return;
        fs.writeFileSync(path, '');
      }
    );
  };

  /**
   * Saves a log entity to the appropriate log file based on severity level.
   * @param log The log entity to save.
   */
  async saveLog(log: LogEntity): Promise<void> {
    const logAsJson = `${JSON.stringify(log)}\n`;

    fs.appendFileSync(this.allLogsPath, logAsJson);

    if (log.level === LogSeverityLevel.low) return;
    if (log.level === LogSeverityLevel.medium)
      fs.appendFileSync(this.mediumLogsPath, logAsJson);
    if (log.level === LogSeverityLevel.high)
      fs.appendFileSync(this.highLogsPath, logAsJson);
  }

  /**
   * Retrieves logs of the specified severity level from the appropriate log file.
   * @param severityLevel The severity level of the logs to retrieve.
   * @returns An array of log entities.
   */
  private getLogsFromFile = (path: string): LogEntity[] => {
    const content = fs.readFileSync(path, 'utf8');

    if (content === '') return [];

    // const logs = content.split('\n').map((log) => LogEntity.fromJson(log));
    const logs = content.split('\n').map(LogEntity.fromJson);

    return logs;
  };

  /**
   * Gets logs of the specified severity level.
   * @param severityLevel The severity level of the logs to retrieve.
   * @returns An array of log entities.
   */
  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    switch (severityLevel) {
      case LogSeverityLevel.low:
        return this.getLogsFromFile(this.allLogsPath);

      case LogSeverityLevel.medium:
        return this.getLogsFromFile(this.mediumLogsPath);

      case LogSeverityLevel.high:
        return this.getLogsFromFile(this.highLogsPath);

      default:
        throw new Error(`${severityLevel} not implemented`);
    }
  }
}
