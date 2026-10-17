import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';
import { AUTH_COOKIE_NAME } from '../utils/token.util';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function rejectOrigin(res: Response): void {
  res.status(403).json({
    status: 'error',
    message: 'Request origin is not permitted.',
  });
}

/**
 * Validate Origin on unsafe requests. Cookie-authenticated browser mutations
 * must include an exact configured origin. Non-browser clients may omit Origin
 * as long as they do not present a browser session cookie.
 */
export function validateRequestOrigin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!MUTATING_METHODS.has(req.method)) {
    next();
    return;
  }

  const origin = req.get('origin');
  if (origin === undefined) {
    const hasCookieSession = Boolean(req.cookies?.[AUTH_COOKIE_NAME]);
    if (hasCookieSession) {
      rejectOrigin(res);
      return;
    }

    next();
    return;
  }

  let normalizedOrigin: string;
  try {
    if (origin === 'null') throw new Error();
    const parsed = new URL(origin);
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.origin !== origin) {
      throw new Error();
    }
    normalizedOrigin = parsed.origin;
  } catch {
    rejectOrigin(res);
    return;
  }

  if (!config.clientOrigins.includes(normalizedOrigin)) {
    rejectOrigin(res);
    return;
  }

  next();
}

/** Small in-memory fixed-window limiter for authentication endpoints. */
export function createRateLimiter(maxRequests: number, windowMs: number) {
  const requestsByClient = new Map<string, { count: number; resetAt: number }>();
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of requestsByClient) {
      if (entry.resetAt <= now) requestsByClient.delete(key);
    }
  }, windowMs);
  cleanupTimer.unref?.();

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    let entry = requestsByClient.get(key);

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      requestsByClient.set(key, entry);
    }

    entry.count += 1;
    if (entry.count > maxRequests) {
      res.setHeader('Retry-After', String(Math.max(1, Math.ceil((entry.resetAt - now) / 1000))));
      res.status(429).json({
        status: 'error',
        message: 'Too many authentication attempts. Please try again later.',
      });
      return;
    }

    next();
  };
}

export const authRateLimiter = createRateLimiter(
  config.authRateLimitMax,
  config.authRateLimitWindowMs
);
