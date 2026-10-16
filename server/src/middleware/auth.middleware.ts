import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth.types';
import { AUTH_COOKIE_NAME, verifyAuthToken } from '../utils/token.util';

/**
 * Helper to extract JWT token from HttpOnly cookie or Authorization header
 */
export function extractToken(req: AuthenticatedRequest): string | null {
  // 1. Primary: HttpOnly cookie
  if (req.cookies && req.cookies[AUTH_COOKIE_NAME]) {
    return req.cookies[AUTH_COOKIE_NAME];
  }

  // 2. Secondary: Authorization: Bearer <token> header (API clients / tests)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  return null;
}

/**
 * Strict authentication middleware.
 * Rejects unauthenticated or invalidly authenticated requests with 401.
 */
export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const token = extractToken(req);

  if (!token) {
    res.status(401).json({
      status: 'error',
      message: 'Authentication required. Please sign in.',
    });
    return;
  }

  const payload = verifyAuthToken(token);
  if (!payload) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid or expired session. Please sign in again.',
    });
    return;
  }

  req.user = payload;
  next();
}

/**
 * Optional authentication middleware.
 * If valid token is supplied, attaches req.user. Does not block unauthenticated access.
 */
export function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  const token = extractToken(req);
  if (token) {
    const payload = verifyAuthToken(token);
    if (payload) {
      req.user = payload;
    }
  }
  next();
}
