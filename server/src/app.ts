import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config/env';
import apiRouter from './routes';
import { getHealth } from './controllers/health.controller';
import { validateRequestOrigin } from './middleware/security.middleware';

const app: Application = express();

// Security middleware
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(
  cors({
    origin: (origin, callback) => {
      // Requests without Origin are non-browser clients and need no CORS headers.
      if (!origin) {
        callback(null, false);
      } else if (config.clientOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Leave health checks and other server responses available; browsers
        // cannot read responses without the allow-origin header.
        callback(null, false);
      }
    },
    credentials: true,
  })
);

// Cookie parser for secure HttpOnly session tokens
app.use(cookieParser());

// CORS is not CSRF protection: reject untrusted origins on state changes.
app.use(validateRequestOrigin);

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb', parameterLimit: 1000 }));


// Lightweight request logging middleware for development
app.use((req: Request, _res: Response, next: NextFunction) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Root ping & direct health check endpoints
app.get('/', getHealth);
app.get('/health', getHealth);

// Versioned API routes
app.use('/api', apiRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const status = (err as Error & { status?: number }).status;
  if (status === 413) {
    res.status(413).json({
      status: 'error',
      message: 'Request body is too large.',
    });
    return;
  }

  console.error('[Unhandled Error]', err);
  res.status(500).json({
    status: 'error',
    message: config.nodeEnv === 'production' ? 'Internal server error' : err.message,
  });
});

export default app;
