// app/api/grid-config/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql'; // dùng mssql package
import poolPromise,{ SqlExec } from '@/lib/db';

export async function GET(req: NextRequest) {
  const viewId = req.nextUrl.searchParams.get('viewId');
  console.log('viewId', viewId);
  const result = await SqlExec(`SELECT * FROM sysGridConfig WHERE ViewId = '${viewId}'`) as { recordset: { Config: string }[] };
  if (result instanceof Error) {
        return NextResponse.json({ message: 'Failed to get grid config', error: result.message }, { status: 500 });
    }
    if (result.recordset.length === 0) {
        return NextResponse.json({ message: 'No config found' }, { status: 404 });
    }
  const config = result.recordset[0]?.Config;;
  return NextResponse.json(config ? JSON.parse(config) : null);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { viewId, config } = body;
  const conn = await poolPromise;
  const configJson = JSON.stringify(config);

  await conn.request()
    .input('viewId', sql.NVarChar, viewId)
    .input('config', sql.NVarChar(sql.MAX), configJson)
    .query(`
      MERGE sysGridConfig AS target
      USING (SELECT @viewId AS ViewId) AS source
      ON target.ViewId = source.ViewId
      WHEN MATCHED THEN
        UPDATE SET Config = @config
      WHEN NOT MATCHED THEN
        INSERT (ViewId, Config) VALUES (@viewId, @config);`);

  return NextResponse.json({ success: true });
}
