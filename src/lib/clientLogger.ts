// Logger que funciona tanto en cliente como servidor
interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

const LOG_LEVELS: LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

class ClientLogger {
  private isServer = typeof window === 'undefined';

  private async sendToServer(level: string, message: string, meta?: any) {
    if (!this.isServer) {
      try {
        await fetch('/api/logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            level,
            message,
            meta,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
          }),
        });
      } catch (error) {
        console.warn('Failed to send log to server:', error);
      }
    }
  }

  error(message: string, meta?: any) {
    console.error(message, meta);
    this.sendToServer(LOG_LEVELS.ERROR, message, meta);
  }

  warn(message: string, meta?: any) {
    console.warn(message, meta);
    this.sendToServer(LOG_LEVELS.WARN, message, meta);
  }

  info(message: string, meta?: any) {
    console.info(message, meta);
    this.sendToServer(LOG_LEVELS.INFO, message, meta);
  }

  debug(message: string, meta?: any) {
    console.debug(message, meta);
    this.sendToServer(LOG_LEVELS.DEBUG, message, meta);
  }
}

export const clientLogger = new ClientLogger();
export default clientLogger;