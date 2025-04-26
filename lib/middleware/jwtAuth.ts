// lib/middleware/jwtAuth.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';



export function jwtAuth(req: any) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Unauthorized: Token missing or invalid' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    //req.userId = decoded.userId; // Thêm userId vào request để sử dụng sau này
  } catch (err) {
    return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
  }

  return NextResponse.next(); // Tiếp tục xử lý request nếu token hợp lệ
}
