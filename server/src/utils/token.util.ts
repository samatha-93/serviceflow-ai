import jwt from 'jsonwebtoken';
import { Response, CookieOptions } from 'express';
import { config } from '../config/env';
import { AuthTokenPayload } from '../types/auth.types';

export const AUTH_COOKIE_NAME = 'serviceflow_token';

/**
 * Generate a signed JWT token with user credentials and business tenant ID.
 */
export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as any,
  });
}

/**
 * Verify and decode an authentication JWT token.
 * Returns decoded payload if valid, or null if invalid or expired.
 */
export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as AuthTokenPayload;
    if (decoded && decoded.userId && decoded.businessId) {
      return decoded;
    }
    return null;
  } catch (_err) {
    return null;
  }
}

/**
 * Express cookie options for secure HttpOnly cookie handling.
 * - httpOnly: prevents client-side JavaScript access (mitigates XSS token theft)
 * - secure: enforces HTTPS in production environments
 * - sameSite: 'lax' for development / first-party, 'strict' in production
 * - maxAge: 7 days
 */
export function getAuthCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
}

/**
 * Attach the HttpOnly authentication cookie to the response.
 */
export function setAuthCookie(res: Response, token: string): void {
  res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
}

/**
 * Clear the HttpOnly authentication cookie from the response.
 */
export function clearAuthCookie(res: Response): void {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'strict' : 'lax',
    path: '/',
  });
}
