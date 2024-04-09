import { LogModel } from '../../data/mongo';
import { LogDatasource } from '../../domain/datasources/log.datasource';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';

/**
 * Data source class for managing logs stored in a MongoDB database.
 */
export class MongoLogDataSource implements LogDatasource {
  /**
   * Saves a log entity to the MongoDB database.
   * @param log The log entity to save.
   */
  async saveLog(log: LogEntity): Promise<void> {
    const newLog = await LogModel.create(log);
    console.log('Mongo Log Created:', newLog.id);
  }

  /**
   * Retrieves logs of the specified severity level from the MongoDB database.
   * @param severityLevel The severity level of the logs to retrieve.
   * @returns An array of log entities.
   */
  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    const logsBySeverity = await LogModel.find({ level: severityLevel });

    return logsBySeverity.map(LogEntity.fromObject);
  }
}
