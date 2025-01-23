import winston from 'winston';
import path from 'path';
import fs from 'fs';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.json()
    ),
    transports: [
        // Guardar logs de error en error.log
        new winston.transports.File({ 
            filename: path.join(process.cwd(), 'logs', 'error.log'), 
            level: 'error' 
        }),
        // Guardar todos los logs en combined.log
        new winston.transports.File({ 
            filename: path.join(process.cwd(), 'logs', 'combined.log')
        })
    ]
});

// Si no estamos en producción, también log a consola
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

// Crear directorio de logs si no existe
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

export default logger; 