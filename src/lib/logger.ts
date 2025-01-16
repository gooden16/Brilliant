type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, context?: Record<string, any>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context
    };
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>) {
    const entry = this.formatMessage(level, message, context);
    this.logs.push(entry);

    const logMethod = level === 'error' ? console.error : 
                     level === 'warn' ? console.warn : 
                     console.log;

    logMethod(`[${entry.timestamp}] [${level.toUpperCase()}] ${message}`, context || '');

    // In production, you might want to send this to a logging service
    if (import.meta.env.PROD) {
      // TODO: Implement production logging service integration
    }
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, any>) {
    this.log('error', message, context);
  }

  getLogs(): LogEntry[] {
    return this.logs;
  }
}

export const logger = Logger.getInstance();