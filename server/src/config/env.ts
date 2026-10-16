import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';

// Load environment variables from server/.env or root .env if present
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export interface AppConfig {
  port: number;
  nodeEnv: string;
  clientOrigin: string;
  mongodbUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
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

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv,
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/serviceflow-ai',
  jwtSecret: resolveJwtSecret(),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};
