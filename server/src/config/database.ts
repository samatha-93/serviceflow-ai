import mongoose from 'mongoose';
import { config } from './env';
import { seedDemoEnquiries, seedDemoBookings } from '../data/seed';

export type DatabaseStatus = 'connected' | 'connecting' | 'disconnected' | 'offline_mode';

export function getDatabaseStatus(): DatabaseStatus {
  switch (mongoose.connection.readyState) {
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    default:
      return 'disconnected';
  }
}

export async function connectDatabase(): Promise<void> {
  // Check if we should attempt connection
  if (!config.mongodbUri) {
    console.log('[Database] No MONGODB_URI configured. Running in offline/standalone mode.');
    return;
  }

  try {
    // Set a short connection timeout so development starts quickly even if MongoDB isn't running locally
    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[Database] Successfully connected to MongoDB: ${mongoose.connection.name}`);
    await seedDemoEnquiries();
    await seedDemoBookings();
  } catch (error) {

    const message = error instanceof Error ? error.message : 'Unknown error';
    console.warn(`[Database] Standby mode: Could not reach MongoDB (${message}).`);
    console.warn('[Database] Backend health check and mock APIs remain fully operational.');
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('[Database] Disconnected from MongoDB.');
  }
}
