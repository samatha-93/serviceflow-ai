import app from './app';
import { config } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';

async function bootstrap() {
  const server = app.listen(config.port, () => {
    console.log('====================================================');
    console.log(` ServiceFlow AI - Backend API`);
    console.log(` Tagline: Less Admin. Better Business.`);
    console.log(` Status: Server running on port ${config.port}`);
    console.log(` Environment: ${config.nodeEnv}`);
    console.log(` Health check: http://localhost:${config.port}/api/health`);
    console.log('====================================================');
  });

  // Connect to database in the background (non-blocking)
  connectDatabase();

  // Graceful shutdown handling
  const shutdown = async (signal: string) => {
    console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDatabase();
      console.log('[Server] Process terminated cleanly.');
      process.exit(0);
    });

    // Force shutdown after timeout if pending connections hang
    setTimeout(() => {
      console.error('[Server] Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 5000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((error) => {
  console.error('[Bootstrap Error] Failed to start server:', error);
  process.exit(1);
});
