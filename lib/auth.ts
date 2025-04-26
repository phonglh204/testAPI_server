import jwt from 'jsonwebtoken';

export function verifyToken(token: string): { userId: number; username: string } | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as any;
  } catch {
    return null;
  }
}
