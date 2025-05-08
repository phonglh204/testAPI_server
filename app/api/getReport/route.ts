import { NextRequest, NextResponse } from 'next/server';
import poolPromise, { SqlExec, GetParaOfStore } from '@/lib/db';
import sql from 'mssql';
import { verifyTokenFromNextRequest } from '@/lib/jwt-utils';

const metadataCache = new Map<string, any[]>();
const _key = process.env.NEXT_PUBLIC_KEY || ""; // Key for filtering data

export async function POST(req: NextRequest) {
  try {
    const decoded = verifyTokenFromNextRequest(req); 
        if(!decoded) return NextResponse.json({ message: 'Invalid Token' }, { status: 401 });
    const { code, para } = await req.json();
    const data = await SqlExec(`SELECT code,name FROM sysStoreConfig  WHERE a.Code = '${code}' and isActive=1`);
      if(data.length === 0) {
        return NextResponse.json({ message: 'No config found' }, { status: 404 });
      }
    const storeName = data[0].name;
    let paramDefs: any[];
    if (metadataCache.has(storeName)) {
      paramDefs = metadataCache.get(storeName) || [];
    } else {
      paramDefs = await GetParaOfStore(storeName);
      if (paramDefs instanceof Error) {
        return NextResponse.json({ message: 'Failed to execute command', error: paramDefs.message }, { status: 500 });
      }
      metadataCache.set(storeName, paramDefs);
    }
    const pool = await poolPromise;
    const request = pool.request();
    for (const p of paramDefs) {
      const paramName = p.ParamName.replace('@', '');
      const value = para?.[paramName] ?? null;
      const sqlTypeKey = p.type.charAt(0).toUpperCase() + p.type.slice(1).toLowerCase();
      const type = sql[sqlTypeKey as keyof typeof sql] || sql.NVarChar;
      if (p.maxLength > 0) {
        request.input(paramName, type(p.maxLength), value);
      } else {
        request.input(paramName, type, value);
      }
    }
    const result = await request.execute(storeName);

      if (result instanceof Error) {
        return NextResponse.json({ message: 'Failed to execute command', error: result.message }, { status: 500 });
      }
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to get units', error }, { status: 500 });
  }
}


