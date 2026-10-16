import mongoose from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { UserModel, UserDocument, toUserProfile } from '../models/user.model';
import { RegisterDTO, UserProfile } from '../types/auth.types';
import { DatabaseUnavailableError } from './enquiry.repository';

export class UserRepository {
  /**
   * Check whether MongoDB connection is actively established and ready
   */
  public isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  /**
   * Look up a user document by normalized email address
   */
  public async findByEmail(email: string): Promise<UserDocument | null> {
    if (!this.isConnected()) {
      throw new DatabaseUnavailableError('Database is currently unavailable.');
    }

    const normalizedEmail = email.trim().toLowerCase();
    return UserModel.findOne({ email: normalizedEmail }).exec();
  }

  /**
   * Look up a user document by unique user id
   */
  public async findById(id: string): Promise<UserDocument | null> {
    if (!this.isConnected()) {
      throw new DatabaseUnavailableError('Database is currently unavailable.');
    }

    return UserModel.findOne({ id: id.trim() }).exec();
  }

  /**
   * Register a new business owner account with a unique businessId.
   * Never stores plaintext passwords.
   */
  public async create(dto: RegisterDTO): Promise<UserProfile> {
    if (!this.isConnected()) {
      throw new DatabaseUnavailableError(
        'Database is currently unavailable. Cannot register account while offline.'
      );
    }

    const normalizedEmail = dto.email.trim().toLowerCase();
    const existing = await UserModel.findOne({ email: normalizedEmail }).exec();
    if (existing) {
      const error: any = new Error('An account with this email address already exists.');
      error.code = 'EMAIL_EXISTS';
      throw error;
    }

    // Generate unique IDs
    const randomSuffix = crypto.randomBytes(4).toString('hex');
    const userId = `usr_${Date.now().toString(36)}_${randomSuffix}`;
    const businessId = `biz_${Date.now().toString(36)}_${randomSuffix}`;

    // Hash password with salt rounds = 10
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    const createdDoc = await UserModel.create({
      id: userId,
      email: normalizedEmail,
      passwordHash,
      name: dto.name.trim(),
      businessName: dto.businessName.trim(),
      businessId,
      role: 'owner',
    });

    return toUserProfile(createdDoc);
  }

  /**
   * Compare a plaintext password with the stored bcrypt password hash
   */
  public async comparePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}

export const userRepository = new UserRepository();
