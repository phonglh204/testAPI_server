import { NextResponse } from 'next/server';
import poolPromise from '@/lib/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

const ACCESS_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '7d';

export async function POST(req: Request) {
  const { username, password } = await req.json();
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('username', username)
      .input('password', password)
      .query('SELECT * FROM UserAccount WHERE Username = @username AND IsActive = 1 AND Password= @password');
    const user = result.recordset[0];
    if (!user) {
      return NextResponse.json({ error: 'Sai tên đăng nhập hoặc mật khẩu' }, { status: 401 });
    }
    /*
        if (!user || !(await bcrypt.compare(password, user.PasswordHash))) {
          return NextResponse.json({ error: 'Sai tên đăng nhập hoặc mật khẩu' }, { status: 401 });
        }
    */
    const accessToken = jwt.sign(
      { userId: user.UserId, username: user.Username, role: user.Role },
      process.env.JWT_SECRET!,
      { expiresIn: ACCESS_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { userId: user.UserId },
      process.env.JWT_SECRET!,
      { expiresIn: REFRESH_EXPIRES_IN }
    );

    const now = new Date();
    const accessExpiry = new Date(now.getTime() + 180 * 60 * 1000); // 15 phút
    const refreshExpiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 ngày
    await pool.request()
      .input('UserId', user.UserId)
      .input('AccessToken', accessToken)
      .input('RefreshToken', refreshToken)
      .input('ExpiryDate', accessExpiry)
      .input('RefreshExpiryDate', refreshExpiry)
      .input('CreatedByIP', req.headers.get('x-forwarded-for') || 'unknown')
      .query(`
        INSERT INTO UserToken (UserId, AccessToken, RefreshToken, ExpiryDate, RefreshExpiryDate, CreatedByIP)
        VALUES (@UserId, @AccessToken, @RefreshToken, @ExpiryDate, @RefreshExpiryDate, @CreatedByIP)
      `);
      return NextResponse.json({ accessToken,refreshToken });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
