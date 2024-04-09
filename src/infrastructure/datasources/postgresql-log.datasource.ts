import { LogDatasource } from '../../domain/datasources/log.datasource';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';
import { PrismaClient } from '@prisma/client';

/**
 * Data source class for managing logs stored in a PostgreSQL database.
 */
export class PostgreSQLLogDatasource implements LogDatasource {
  private prisma = new PrismaClient();

  /**
   * Maps a string representation of severity level to its corresponding enum value.
   * @param level The string representation of severity level.
   * @returns The enum value representing the severity level.
   */
  private getSeverityLevel(level: string): 'LOW' | 'MEDIUM' | 'HIGH' {
    const severityLevel =
      level === 'low' ? 'LOW' : level === 'medium' ? 'MEDIUM' : 'HIGH';

    return severityLevel;
  }

  /**
   * Test method to expose the private getSeverityLevel function.
   */
  public __test__ = {
    getSeverityLevel: this.getSeverityLevel,
  };

  /**
   * Saves a log entity to the PostgreSQL database.
   * @param log The log entity to save.
   */
  async saveLog(log: LogEntity): Promise<void> {
    const newLog = await this.prisma.logModel.create({
      data: {
        message: log.message,
        origin: log.origin,
        level: this.getSeverityLevel(log.level),
        createdAt: log.createdAt,
      },
    });

    console.log('Postgre Log Created:', newLog.id);
  }

  /**
   * Retrieves logs of the specified severity level from the PostgreSQL database.
   * @param severityLevel The severity level of the logs to retrieve.
   * @returns An array of log entities.
   */
  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    const logsBySeverity = await this.prisma.logModel.findMany({
      where: { level: this.getSeverityLevel(severityLevel) },
    });

    return logsBySeverity.map(LogEntity.fromObject);
  }
}
