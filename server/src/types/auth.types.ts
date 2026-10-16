import { Request } from 'express';

export type UserRole = 'owner' | 'staff' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  businessName: string;
  businessId: string;
  role: UserRole;
  createdAt?: Date | string;
}

export interface RegisterDTO {
  name: string;
  businessName: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthTokenPayload {
  userId: string;
  businessId: string;
  email: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}
