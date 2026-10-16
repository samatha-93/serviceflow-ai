import { Response } from 'express';
import { AuthenticatedRequest, RegisterDTO, LoginDTO } from '../types/auth.types';
import { userRepository } from '../repositories/user.repository';
import { toUserProfile } from '../models/user.model';
import { signAuthToken, setAuthCookie, clearAuthCookie } from '../utils/token.util';
import { DatabaseUnavailableError } from '../repositories/enquiry.repository';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Register a new business owner account.
 * Assigns a unique businessId for tenant data isolation.
 */
export async function register(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { name, businessName, email, password } = req.body as Partial<RegisterDTO>;

    // 1. Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.status(400).json({
        status: 'error',
        message: 'Name is required and must be at least 2 characters.',
      });
      return;
    }

    if (!businessName || typeof businessName !== 'string' || businessName.trim().length < 2) {
      res.status(400).json({
        status: 'error',
        message: 'Business name is required and must be at least 2 characters.',
      });
      return;
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      res.status(400).json({
        status: 'error',
        message: 'A valid email address is required.',
      });
      return;
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      res.status(400).json({
        status: 'error',
        message: 'Password must be at least 8 characters long.',
      });
      return;
    }

    // 2. Persistence
    const userProfile = await userRepository.create({
      name: name.trim(),
      businessName: businessName.trim(),
      email: email.trim(),
      password,
    });

    // 3. Issue Token & Set HttpOnly Cookie
    const token = signAuthToken({
      userId: userProfile.id,
      businessId: userProfile.businessId,
      email: userProfile.email,
      role: userProfile.role,
    });

    setAuthCookie(res, token);

    res.status(201).json({
      status: 'success',
      message: 'Account registered successfully.',
      data: {
        user: userProfile,
        token,
      },
    });
  } catch (error: any) {
    if (error.code === 'EMAIL_EXISTS') {
      res.status(409).json({
        status: 'error',
        message: error.message,
      });
      return;
    }

    if (error instanceof DatabaseUnavailableError) {
      res.status(503).json({
        status: 'error',
        message: error.message,
      });
      return;
    }

    console.error('[Auth Controller - Register Error]', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to complete registration.',
    });
  }
}

/**
 * Authenticate existing user and issue session token.
 */
export async function login(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as Partial<LoginDTO>;

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({
        status: 'error',
        message: 'Email and password are required.',
      });
      return;
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      // Use uniform error message to prevent account enumeration
      res.status(401).json({
        status: 'error',
        message: 'Invalid email or password.',
      });
      return;
    }

    const passwordMatch = await userRepository.comparePassword(password, user.passwordHash);
    if (!passwordMatch) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid email or password.',
      });
      return;
    }

    const userProfile = toUserProfile(user);
    const token = signAuthToken({
      userId: userProfile.id,
      businessId: userProfile.businessId,
      email: userProfile.email,
      role: userProfile.role,
    });

    setAuthCookie(res, token);

    res.status(200).json({
      status: 'success',
      message: 'Authentication successful.',
      data: {
        user: userProfile,
        token,
      },
    });
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) {
      res.status(503).json({
        status: 'error',
        message: error.message,
      });
      return;
    }

    console.error('[Auth Controller - Login Error]', error);
    res.status(500).json({
      status: 'error',
      message: 'Authentication failed due to an unexpected error.',
    });
  }
}

/**
 * Get current authenticated user profile.
 */
export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required.',
      });
      return;
    }

    const user = await userRepository.findById(req.user.userId);
    if (!user) {
      clearAuthCookie(res);
      res.status(401).json({
        status: 'error',
        message: 'Account not found. Please sign in again.',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: toUserProfile(user),
      },
    });
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) {
      res.status(503).json({
        status: 'error',
        message: error.message,
      });
      return;
    }

    console.error('[Auth Controller - getMe Error]', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve user profile.',
    });
  }
}

/**
 * Terminate authenticated session by clearing HttpOnly cookie.
 */
export async function logout(_req: AuthenticatedRequest, res: Response): Promise<void> {
  clearAuthCookie(res);
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully.',
  });
}
