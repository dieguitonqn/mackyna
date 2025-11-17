import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger'; // Tu logger de Winston

export async function POST(request: NextRequest) {
  try {
    const { level, message, meta, timestamp, userAgent, url } = await request.json();
    
    // Añadir información del cliente al log
    const clientInfo = {
      userAgent,
      url,
      timestamp,
      source: 'client',
      ...meta
    };

    // Usar el logger de Winston en el servidor
    switch (level) {
      case 'error':
        logger.error(`[CLIENT] ${message}`, clientInfo);
        break;
      case 'warn':
        logger.warn(`[CLIENT] ${message}`, clientInfo);
        break;
      case 'info':
        logger.info(`[CLIENT] ${message}`, clientInfo);
        break;
      case 'debug':
        logger.debug(`[CLIENT] ${message}`, clientInfo);
        break;
      default:
        logger.info(`[CLIENT] ${message}`, clientInfo);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error processing client log:', error);
    return NextResponse.json({ error: 'Failed to process log' }, { status: 500 });
  }
}