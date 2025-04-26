import { NextRequest, NextResponse } from 'next/server';
import poolPromise from '@/lib/db';
import { verifyToken, verifyTokenFromNextRequest } from '@/lib/jwt-utils';

export async function GET(req: NextRequest) {
  try {
    const decoded = verifyTokenFromNextRequest(req);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    const userId = decoded.userId;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("userid", userId)
      .query(`SELECT c.CompanyId, c.CompanyName, p.CanAccess, p.CanCreate, p.CanEdit, p.CanDelete
      FROM UserCompanyPermissions p
      JOIN Companies c ON c.CompanyId = p.CompanyId
      WHERE p.UserId = @userid AND p.CanAccess = 1`);
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to get units', error }, { status: 500 });
  }
}
