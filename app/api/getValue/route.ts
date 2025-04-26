import { NextRequest, NextResponse } from 'next/server';
import poolPromise from '@/lib/db';
import { verifyTokenFromNextRequest } from '@/lib/jwt-utils';

export async function POST(req: NextRequest) {
  try {
    const decoded = verifyTokenFromNextRequest(req); 
        if(!decoded) return NextResponse.json({ message: 'Invalid Token' }, { status: 401 });
    const { tablename, fieldname, key } = await req.json();

    const pool = await poolPromise;
    const result=await pool
    .request()
    .query(`SELECT ${fieldname} FROM ${tablename} WHERE ${key}`);
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to get units', error }, { status: 500 });
  }
}


