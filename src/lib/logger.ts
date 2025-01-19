/**
 * Log levels supported by the logger
 */
type LogLevel = 'info' | 'warn' | 'error';

/**
 * Structure of a log entry
 */
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
}

/**
 * Singleton logger class for consistent logging across the application
 * Supports multiple log levels and structured logging with context
 */
class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];

  private constructor() {}

  /**
   * Gets the singleton instance of the logger
   * @returns Logger instance
   */
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Formats a log message with timestamp and context
   * @param level - Log level
   * @param message - Log message
   * @param context - Optional context object
   * @returns Formatted log entry
   */
  private formatMessage(level: LogLevel, message: string, context?: Record<string, any>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context
    };
  }

  /**
   * Internal logging method that handles all log levels
   * @param level - Log level
   * @param message - Log message
   * @param context - Optional context object
   */
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

  /**
   * Logs an informational message
   * @param message - Log message
   * @param context - Optional context object
   */
  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }

  /**
   * Logs a warning message
   * @param message - Log message
   * @param context - Optional context object
   */
  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }

  /**
   * Logs an error message
   * @param message - Log message
   * @param context - Optional context object
   */
  error(message: string, context?: Record<string, any>) {
    this.log('error', message, context);
  }

  /**
   * Gets all logged entries
   * @returns Array of log entries
   */
  getLogs(): LogEntry[] {
    return this.logs;
  }
}

export const logger = Logger.getInstance();