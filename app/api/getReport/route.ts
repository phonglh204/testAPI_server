import { NextRequest, NextResponse } from 'next/server';
import poolPromise, { SqlExec } from '@/lib/db';
import { verifyTokenFromNextRequest } from '@/lib/jwt-utils';

export async function GET(req: NextRequest) {
  try {
    const decoded = verifyTokenFromNextRequest(req); 
        if(!decoded) return NextResponse.json({ message: 'Invalid Token' }, { status: 401 });
    const { type, code, key } = await req.json();
    let tableName = 'sysDir';
    if (!type) {tableName='sysLookup';}
    const data = await SqlExec(`SELECT a.TableName,a.OrderBy,a.Filter,b.Fields FROM ${tableName} a JOIN sysGridConfig b on a.ViewId=b.ViewId WHERE a.Code = '${code}'`) as { 
      recordset: { TableName: string; OrderBy: string; Filter: string; Fields: string }[] };
      if(data.recordset.length === 0) {
        return NextResponse.json({ message: 'No config found' }, { status: 404 });
      }
      let _key="";
      if (key)  if(key!=="") _key = key;
      if (data.recordset[0].Filter) if(data.recordset[0].Filter!=="") 
        if(_key==="") _key = data.recordset[0].Filter;
        else _key = `${_key} and ${data.recordset[0].Filter}`;
      
      let cmd=`select ${data.recordset[0].Fields} from ${data.recordset[0].TableName}`;
      if (_key!=="") {
        cmd+=` where ${_key}`;
      }
      if (data.recordset[0].OrderBy) {
        cmd+=` order by ${data.recordset[0].OrderBy}`;
      }      
      console.log("cmd",cmd)
      const result = await SqlExec(cmd) as { recordset: any[] };
      if (result instanceof Error) {
        return NextResponse.json({ message: 'Failed to execute command', error: result.message }, { status: 500 });
      }
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to get units', error }, { status: 500 });
  }
}


