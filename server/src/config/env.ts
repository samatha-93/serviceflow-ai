import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';

// Load environment variables from server/.env or root .env if present
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export interface AppConfig {
  port: number;
  nodeEnv: string;
  clientOrigins: string[];
  mongodbUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  authRateLimitMax: number;
  authRateLimitWindowMs: number;
}

const nodeEnv = process.env.NODE_ENV || 'development';

function resolveJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (nodeEnv === 'production') {
    if (!secret || secret.trim().length < 32) {
      throw new Error(
        'FATAL: JWT_SECRET environment variable is missing or insecure (< 32 chars) in production.'
      );
    }
    return secret.trim();
  }

  if (secret && secret.trim().length >= 16) {
    return secret.trim();
  }

  // In non-production without a configured secret, generate an ephemeral cryptographically strong secret.
  // Never use a static/hardcoded insecure string fallback.
  console.warn(
    '[Security Notice] JWT_SECRET not set in environment. Generated ephemeral 256-bit runtime secret for development.'
  );
  return crypto.randomBytes(32).toString('hex');
}

function resolveClientOrigins(): string[] {
  const configured = process.env.CLIENT_ORIGINS !== undefined
    ? process.env.CLIENT_ORIGINS.split(',')
    : process.env.CLIENT_ORIGIN !== undefined
      ? [process.env.CLIENT_ORIGIN]
      : nodeEnv === 'development'
        ? ['http://localhost:5173']
        : [];

  return configured.map((value) => {
    const candidate = value.trim();
    try {
      const parsed = new URL(candidate);
      if (
        !candidate ||
        !['http:', 'https:'].includes(parsed.protocol) ||
        parsed.pathname !== '/' ||
        parsed.search ||
        parsed.hash ||
        parsed.username ||
        parsed.password
      ) {
        throw new Error();
      }
      return parsed.origin;
    } catch {
      throw new Error('CLIENT_ORIGINS must contain comma-separated HTTP(S) origins.');
    }
  });
}

function resolvePositiveInteger(name: string, fallback: number): number {
  const value = process.env[name];
  if (value === undefined) return fallback;

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error(`${name} must be a positive integer.`);
  }
  return parsed;
}

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv,
  clientOrigins: resolveClientOrigins(),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/serviceflow-ai',
  jwtSecret: resolveJwtSecret(),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  authRateLimitMax: resolvePositiveInteger('AUTH_RATE_LIMIT_MAX', 10),
  authRateLimitWindowMs: resolvePositiveInteger('AUTH_RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
};
