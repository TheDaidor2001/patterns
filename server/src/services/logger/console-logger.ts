// src/services/console-logger.ts
import { LoggerSubscriber } from '../../common/interfaces/logger-subscriber';
import { LogLevel } from '../../common/enums/log-level';

// PATTERN: Observer (Subscriber)
class ConsoleLogger implements LoggerSubscriber {
  notify(level: LogLevel, message: string): void {
    if (level === LogLevel.ERROR) {
      console.error(
        `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`
      );
    }
  }
}

export { ConsoleLogger };
