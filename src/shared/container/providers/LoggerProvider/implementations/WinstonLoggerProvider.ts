import { createLogger, LoggerOptions, Logger } from 'winston';
import LoggerProvider from '../models/ILoggerProvider';

class WinstonLoggerProvider implements LoggerProvider {
  private logger: Logger;

  constructor(config: LoggerOptions) {
    this.logger = createLogger(config);
  }

  log(level: string, message: string, metadata: object): void {
    this.logger.log(level, message, { metadata });
  }
}

export default WinstonLoggerProvider;
