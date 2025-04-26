import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import * as path from 'path';

@Injectable()
export class FileLogger extends Logger {
  constructor(protected context?: string | undefined) {
    super();
    this.context = context ?? 'FileLogger';
  }
  async logToFile(entry) {
    const formattedEntry = `[${this.context}] ${Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'Africa/Lagos',
    }).format(new Date())}\t${entry}\n`;

    try {
      if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs'))) {
        await fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs'));
      }

      await fsPromises.appendFile(
        path.join(__dirname, '..', '..', 'logs', 'log_file.log'),
        formattedEntry,
      );
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    }
  }

  log(message: any, ...optionalParams: any[]) {
    super.log(message, ...optionalParams);
    this.logToFile(message);
  }

  fatal(message: any, ...optionalParams: any[]) {
    super.fatal(message, ...optionalParams);
    this.logToFile(message);
  }

  error(message: any, ...optionalParams: any[]) {
    super.error(message, ...optionalParams);
    this.logToFile(message);
  }

  warn(message: any, ...optionalParams: any[]) {
    super.warn(message, ...optionalParams);
    this.logToFile(message);
  }

  debug(message: any, ...optionalParams: any[]) {
    super.debug(message, ...optionalParams);
    this.logToFile(message);
  }

  verbose(message: any, ...optionalParams: any[]) {
    super.verbose(message, ...optionalParams);
    this.logToFile(message);
  }
}
