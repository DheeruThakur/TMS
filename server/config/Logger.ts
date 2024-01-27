import winston from 'winston';

class Logger {
  private levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  };
  private colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
  };
  public log;
  constructor() {
    winston.addColors(this.colors);
    this.log = winston.createLogger({
      level: this.level(),
      levels: this.levels,
      format: this.winstonFormat(),
      transports: this.winstonTransports(),
    });
  }
  private level() {
    const env = process.env.NODE_ENV || 'development';
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'warn';
  }
  private winstonFormat() {
    return winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
      // winston.format.colorize({ all: true }),
      // winston.format.printf((info) => `{ level: ${info.level},  timestamps: [${info.timestamp}], message: ${info.message} }`),
      winston.format.json()
    );
  }
  private winstonTransports() {
    return [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      }),
      new winston.transports.File({ filename: 'logs/all.log' }),
    ];
  }
}
export default Logger;