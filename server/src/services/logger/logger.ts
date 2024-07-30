// src/services/logger.ts
import { LoggerSubscriber } from '../../common/interfaces/logger-subscriber';
import { LogLevel } from '../../common/enums/log-level';

// PATTERN: Observer (Publisher)
class Logger {
  private subscribers: LoggerSubscriber[] = [];

  public subscribe(subscriber: LoggerSubscriber): void {
    this.subscribers.push(subscriber);
  }

  public log(level: LogLevel, message: string): void {
    for (const subscriber of this.subscribers) {
      subscriber.notify(level, message);
    }
  }
}

const logger = new Logger();
export { logger, LogLevel };
