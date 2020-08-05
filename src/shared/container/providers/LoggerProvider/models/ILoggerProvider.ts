export default interface ILoggerProvider {
  log(level: string, message: string, metadata?: object): void;
}
