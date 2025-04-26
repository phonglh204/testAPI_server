import { NextRequest, NextResponse } from 'next/server';
import poolPromise from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  const { refreshToken } = await req.json();

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;

    const pool = await poolPromise;
    const result = await pool.request()
      .input('UserId', userId)
      .input('RefreshToken', refreshToken)
      .query(`
        SELECT * FROM UserToken 
        WHERE UserId = @UserId 
          AND RefreshToken = @RefreshToken 
          AND IsRevoked = 0
          AND RefreshExpiryDate > GETDATE()
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ error: 'Refresh token không hợp lệ hoặc đã hết hạn' }, { status: 401 });
    }

    const newAccessToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const newAccessExpiry = new Date(Date.now() + 15 * 60 * 1000);

    // Cập nhật access token mới
    await pool.request()
      .input('TokenId', result.recordset[0].TokenId)
      .input('AccessToken', newAccessToken)
      .input('ExpiryDate', newAccessExpiry)
      .query(`
        UPDATE UserToken
        SET AccessToken = @AccessToken, ExpiryDate = @ExpiryDate
        WHERE TokenId = @TokenId
      `);

    return NextResponse.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Token không hợp lệ' }, { status: 401 });
  }
}
