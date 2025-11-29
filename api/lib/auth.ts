// Authentication Utilities
// JWT token handling, password hashing, session management

import { createHash, randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from './db';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRES_IN = '7d';
const REFRESH_TOKEN_EXPIRES_IN = '30d';

export interface AuthUser {
  id: string;
  email: string;
  role: 'homeowner' | 'contractor' | 'operator';
  name: string;
}

export interface TokenPayload extends AuthUser {
  iat?: number;
  exp?: number;
}

/**
 * Hash a password using bcrypt-like approach (for now, simple hash - upgrade to bcrypt in production)
 */
export async function hashPassword(password: string): Promise<string> {
  // In production, use bcrypt: return await bcrypt.hash(password, 10);
  return createHash('sha256').update(password + JWT_SECRET).digest('hex');
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // In production, use bcrypt: return await bcrypt.compare(password, hash);
  const passwordHash = createHash('sha256').update(password + JWT_SECRET).digest('hex');
  return passwordHash === hash;
}

/**
 * Generate JWT access token
 */
export function generateAccessToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Generate refresh token
 */
export function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId, type: 'refresh' }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Get authenticated user from request
 */
export async function getAuthenticatedUser(request: Request): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return null;
    }

    const payload = verifyToken(token);
    if (!payload || !payload.id) {
      return null;
    }

    // Optionally verify user still exists in database
    if (supabaseAdmin) {
      const { data } = await supabaseAdmin
        .from('users')
        .select('id, email, role, name')
        .eq('id', payload.id)
        .single();

      if (!data) {
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        role: data.role,
        name: data.name,
      };
    }

    return payload;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Generate random secure token (for password reset, etc.)
 */
export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

