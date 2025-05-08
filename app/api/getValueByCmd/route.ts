import { NextRequest, NextResponse } from 'next/server';
import poolPromise, { SqlExec } from '@/lib/db';
import { verifyTokenFromNextRequest } from '@/lib/jwt-utils';

export async function POST(req: NextRequest) {
  try {
    const decoded = verifyTokenFromNextRequest(req);
    if (!decoded) return NextResponse.json({ message: 'Invalid Token' }, { status: 401 });
    const { command } = await req.json();
    if (!command) {
      return NextResponse.json({ message: 'Command is required' }, { status: 400 });
    }
    if (typeof command !== 'string') {
      return NextResponse.json({ message: 'Command must be a string' }, { status: 400 });
    }
    if (command.length > 1000) {
      return NextResponse.json({ message: 'Command is too long' }, { status: 400 });
    }
    const result = await SqlExec(command);
    if (result instanceof Error) {
      return NextResponse.json({ message: 'Failed to execute command', error: result.message }, { status: 500 });
    }
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed', error }, { status: 500 });
  }
}


