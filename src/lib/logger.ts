/**
 * Centralized logging utility for MapRanker Pro.
 * Controls log visibility based on environment.
 */

const IS_DEV = import.meta.env.DEV;

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private prefix = '[MapRanker]';

  private shouldLog(level: LogLevel): boolean {
    if (level === 'error') return true; // Always log errors
    return IS_DEV; // Only log others in development
  }

  info(message: string, ...args: unknown[]) {
    if (this.shouldLog('info')) {
      console.log(`%c${this.prefix} %c${message}`, 'color: #3b82f6; font-weight: bold', 'color: inherit', ...args);
    }
  }

  warn(message: string, ...args: unknown[]) {
    if (this.shouldLog('warn')) {
      console.warn(`${this.prefix} ${message}`, ...args);
    }
  }

  error(message: string, ...args: unknown[]) {
    if (this.shouldLog('error')) {
      console.error(`${this.prefix} ${message}`, ...args);
    }
  }

  debug(message: string, ...args: unknown[]) {
    if (this.shouldLog('debug')) {
      console.debug(`%c${this.prefix} [DEBUG] %c${message}`, 'color: #94a3b8; font-weight: bold', 'color: #94a3b8', ...args);
    }
  }
}

export const logger = new Logger();
