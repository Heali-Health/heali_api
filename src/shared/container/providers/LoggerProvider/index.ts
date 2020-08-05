import { container } from 'tsyringe';
import loggerConfig from '@config/logger';
import ILoggerProvider from './models/ILoggerProvider';
import WinstonLoggerProvider from './implementations/WinstonLoggerProvider';

const providers = {
  winston: WinstonLoggerProvider,
};

const Logger = providers[loggerConfig.driver];

container.registerInstance<ILoggerProvider>(
  'LoggerProvider',
  new Logger(loggerConfig.config[loggerConfig.driver]),
);
