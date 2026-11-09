import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger'; // Tu logger de Winston
import { getActiveSession } from '@/lib/getActiveSession';
import { recordAdminEvent } from '@/lib/adminEvents';

const isStaff = (session: Awaited<ReturnType<typeof getActiveSession>>) =>
  ['admin', 'teacher', 'teach'].includes(session?.user?.rol ?? '');

export async function POST(request: NextRequest) {
  try {
    const session = await getActiveSession(request);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    if (!isStaff(session)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const contentLength = Number(request.headers.get('content-length') ?? 0);
    if (contentLength > 12_000) {
      return NextResponse.json({ error: 'Registro demasiado grande' }, { status: 413 });
    }

    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }
    const { level, message, meta, userAgent, url } = body;
    const allowedLevels = ['error', 'warn', 'info', 'debug'];
    if (
      !allowedLevels.includes(level) ||
      typeof message !== 'string' ||
      message.length === 0 ||
      message.length > 1000 ||
      (meta !== undefined && JSON.stringify(meta).length > 8000) ||
      (userAgent !== undefined && (typeof userAgent !== 'string' || userAgent.length > 500)) ||
      (url !== undefined && (typeof url !== 'string' || url.length > 2000))
    ) {
      return NextResponse.json({ error: 'Datos de registro inválidos' }, { status: 400 });
    }

    const clientInfo = {
      userAgent: userAgent ?? null,
      url: url ?? null,
      sessionUserId: session.user?.id?.toString() ?? null,
      source: 'client',
      ...(meta !== undefined ? { meta } : {}),
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

    if (level === 'error' || level === 'warn') {
      let route: string | null = null;
      if (typeof url === 'string') {
        try { route = new URL(url, 'http://localhost').pathname; } catch { route = null; }
      }
      await recordAdminEvent({
        type: level === 'error' ? 'app_error' : 'app_warning',
        actorId: session.user?.id?.toString() ?? null,
        action: level,
        message: message.replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, '[email]'),
        route,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error processing client log:', error);
    return NextResponse.json({ error: 'Failed to process log' }, { status: 500 });
  }
}
