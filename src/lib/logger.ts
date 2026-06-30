import winston from 'winston';
import path from 'path';
import fs from 'fs';

const logDir = path.join(process.cwd(), 'logs');

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const baseFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.json()
);

const logger = winston.createLogger({
    level: 'info',
    format: baseFormat,
    transports: [
        // Guardar logs de error en error.log
        new winston.transports.File({ 
            filename: path.join(logDir, 'error.log'), 
            level: 'error' 
        }),
        new winston.transports.File({ 
            filename: path.join(logDir, 'warn.log'), 
            level: 'warn' 
        }),
        new winston.transports.File({ 
            filename: path.join(logDir, 'info.log'), 
            level: 'info' 
        }),
        new winston.transports.File({ 
            filename: path.join(logDir, 'debug.log'), 
            level: 'debug' 
        }),
        // Guardar todos los logs en combined.log
        new winston.transports.File({ 
            filename: path.join(logDir, 'combined.log')
        })
    ]
});

export const planillaNotasLogger = winston.createLogger({
    level: 'info',
    format: baseFormat,
    transports: [
        new winston.transports.File({
            filename: path.join(logDir, 'planillas-notas.log')
        })
    ]
});

// Si no estamos en producción, también log a consola
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));

    planillaNotasLogger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

export default logger; 