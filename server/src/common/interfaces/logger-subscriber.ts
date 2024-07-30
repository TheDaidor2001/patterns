import { LogLevel } from '../enums/log-level';

export interface LoggerSubscriber {
  notify(level: LogLevel, message: string): void;
}
