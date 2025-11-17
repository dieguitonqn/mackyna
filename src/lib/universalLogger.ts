// Logger que detecta automáticamente el entorno
let serverLogger: any = null;

// Solo importar Winston en el servidor
if (typeof window === 'undefined') {
  // Importación dinámica para evitar errores en el cliente
  import('@/lib/logger').then((module) => {
    serverLogger = module.default;
  });
}

interface LoggerInterface {
  error: (message: string, meta?: any) => void;
  warn: (message: string, meta?: any) => void;
  info: (message: string, meta?: any) => void;
  debug: (message: string, meta?: any) => void;
}

const universalLogger: LoggerInterface = {
  error: (message: string, meta?: any) => {
    if (typeof window === 'undefined' && serverLogger) {
      // Servidor: usar Winston
      serverLogger.error(message, meta);
    } else {
      // Cliente: usar console
      console.error(message, meta);
    }
  },

  warn: (message: string, meta?: any) => {
    if (typeof window === 'undefined' && serverLogger) {
      serverLogger.warn(message, meta);
    } else {
      console.warn(message, meta);
    }
  },

  info: (message: string, meta?: any) => {
    if (typeof window === 'undefined' && serverLogger) {
      serverLogger.info(message, meta);
    } else {
      console.info(message, meta);
    }
  },

  debug: (message: string, meta?: any) => {
    if (typeof window === 'undefined' && serverLogger) {
      serverLogger.debug(message, meta);
    } else {
      console.debug(message, meta);
    }
  }
};

export default universalLogger;