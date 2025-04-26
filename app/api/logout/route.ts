import { NextRequest, NextResponse } from 'next/server';
import poolPromise from '@/lib/db';
import { verifyToken } from '@/lib/jwt-utils';
import {verifyTokenFromNextRequest,getTokenFromHeader} from '@/lib/jwt-utils'

export async function POST(req: NextRequest) {
  try {
    console.log("Kaka -console.log--- Logout request received!");
    //return NextResponse.json({ message: 'Response - Logout request received!' }, { status: 200 });
    /*const token = getTokenFromHeader(req);
    console.log("Logout token:", token);
    const pool = await poolPromise;
    await pool.request()
      .input('token', token)
      .query(`UPDATE UserToken SET IsRevoked = 1, RevokedAt = GETDATE() WHERE AccessToken = @token`);
    */
    /*const response = NextResponse.json({ message: 'Logged out successfully', isok: 1 }, { status: 200 });
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    console.log("Logout success!");*/
    const response = NextResponse.json({ message: 'Logged out successfully', isok: 1 }, { status: 200 });
    return response;
  } catch (error) {
    console.log("Logout failed!");
    return NextResponse.json({ message: 'Logout failed', error}, { status: 400 });
  }
}
