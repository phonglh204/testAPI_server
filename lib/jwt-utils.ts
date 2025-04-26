import jwt, { SignOptions } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const secret = process.env.JWT_SECRET || 'secret';

export function signToken(payload: object, expiresIn: string = '1h'): string {
  return jwt.sign(payload, secret, { expiresIn: '1h' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, secret) as { userId: number; [key: string]: any };
}
export function getTokenFromHeader(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return;
    }
    return authHeader?.split(' ')[1];
}
export function verifyTokenFromNextRequest(req: NextRequest) {
  const token=getTokenFromHeader(req);
  if (!token || typeof token !== 'string') return;
  else return verifyToken(token);
}
