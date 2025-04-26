import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
      return NextResponse.json({ welcome: 'Xin chào' }, { status: 200 });
}
