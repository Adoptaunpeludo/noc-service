import { LogDatasource } from '../../domain/datasources/log.datasource';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';
import { PrismaClient } from '@prisma/client';

export class PostgreSQLLogDatasource implements LogDatasource {
  private prisma = new PrismaClient();

  private getSeverityLevel(level: string): 'LOW' | 'MEDIUM' | 'HIGH' {
    const severityLevel =
      level === 'low' ? 'LOW' : level === 'medium' ? 'MEDIUM' : 'HIGH';

    return severityLevel;
  }

  public __test__ = {
    getSeverityLevel: this.getSeverityLevel,
  };

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
  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    const logsBySeverity = await this.prisma.logModel.findMany({
      where: { level: this.getSeverityLevel(severityLevel) },
    });

    return logsBySeverity.map(LogEntity.fromObject);
  }
}
