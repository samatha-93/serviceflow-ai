import { Request, Response } from 'express';
import { getDatabaseStatus } from '../config/database';
import { config } from '../config/env';

export const getHealth = (_req: Request, res: Response) => {
  const healthData = {
    status: 'ok',
    service: 'ServiceFlow AI API',
    tagline: 'Less Admin. Better Business.',
    version: '0.1.0',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    database: {
      status: getDatabaseStatus(),
    },
    supportedCategories: [
      'Outdoor and property services',
      'Cleaning services',
      'Beauty and wellness',
      'Home maintenance',
      'Independent professionals',
    ],
  };

  res.status(200).json(healthData);
};
