// src/services/file-logger.ts
import * as fs from 'fs';
import * as path from 'path';
import { LoggerSubscriber } from '../../common/interfaces/logger-subscriber';
import { LogLevel } from '../../common/enums/log-level';

// PATTERN: Observer (Subscriber)
class FileLogger implements LoggerSubscriber {
  private logFilePath: string;

  constructor() {
    this.logFilePath = path.join(__dirname, '../../logs/app.log');
    this.ensureLogFileExists();
  }

  private ensureLogFileExists(): void {
    const dirPath = path.dirname(this.logFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    if (!fs.existsSync(this.logFilePath)) {
      fs.writeFileSync(this.logFilePath, '', { flag: 'wx' });
    }
  }

  notify(level: LogLevel, message: string): void {
    const logEntry = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}\n`;
    fs.appendFileSync(this.logFilePath, logEntry);
  }
}

export { FileLogger };
