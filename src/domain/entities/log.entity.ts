export enum LogSeverityLevel {
  low = 'low',
  medium = 'medium',
  high = 'high',
  test = 'test',
}

export interface LogEntityOptions {
  message: string;
  level: LogSeverityLevel;
  origin: string;
  createdAt?: Date;
}

/**
 * Class representing a log entity.
 */
export class LogEntity {
  public message: string;
  public level: LogSeverityLevel;
  public origin: string;
  public createdAt?: Date;

  /**
   * Creates an instance of LogEntity.
   * @param options The options to initialize the log entity.
   */
  constructor(options: LogEntityOptions) {
    (this.message = options.message), (this.level = options.level);
    this.origin = options.origin;
    this.createdAt = new Date();
  }

  /**
   * Creates a LogEntity object from a JSON string.
   * @param json The JSON string representing the log entity.
   * @returns The created LogEntity object.
   */
  static fromJson = (json: string): LogEntity => {
    json = json === '' ? '{}' : json;

    const { message, level, createdAt, origin } = JSON.parse(json);

    const log = new LogEntity({
      message,
      level,
      createdAt: new Date(createdAt),
      origin,
    });

    log.createdAt = new Date(createdAt);

    return log;
  };

  /**
   * Creates a LogEntity object from a plain object.
   * @param object The plain object representing the log entity.
   * @returns The created LogEntity object.
   */
  static fromObject = (object: { [key: string]: any }): LogEntity => {
    const { message, level, createdAt, origin } = object;

    const log = new LogEntity({
      message,
      level,
      createdAt,
      origin,
    });

    return log;
  };
}
