import { NextRequest, NextResponse } from 'next/server';
import poolPromise from '@/lib/db';
import { verifyTokenFromNextRequest } from '@/lib/jwt-utils';

export async function GET(req: NextRequest) {
  try {
    const decoded = verifyTokenFromNextRequest(req); 
    if(!decoded) return NextResponse.json({ message: 'Invalid Token' }, { status: 401 });
    const userId = decoded.userId;

    const pool = await poolPromise;
    const result=await pool
    .request()
    .query(`SELECT TOP 1 * FROM UserAccount WHERE UserId = ${userId}`);
    console.log("getUser OK:"+result)
    return NextResponse.json({ result });
  } catch (error) {
    console.log("Tvo van")
    return NextResponse.json({ message: 'Failed to get units', error }, { status: 500 });
  }
}

