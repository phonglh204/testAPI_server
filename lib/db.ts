// lib/db.ts
import sql from 'mssql';
/*const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || '',
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};*/

const config = {
  user: "sa",
  password: "S1ld1d@@",
  server: "sqlnew.libs.com.vn",
  port: 1436,
  database: "LibsERPOnline",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('❌ SQL Server Connection Error', err);
    throw err;
  });

export async function SqlExec(command: string): Promise<any[]> {
  try {
    console.log(command)
    const pool = await poolPromise;
    const result=await pool
    .request()
    .query(command);
    console.log(result);
    return result.recordset; // ✅ Return the recordset directly
  } catch (error) {
    console.error('❌ SQL Execution Error', error);
    return []; // Return an empty array as a fallback
  }
}
export async function GetParaOfStore(storename: string): Promise<any[]> {
  try {
    let command=`SELECT prm.name AS ParamName, typ.name AS SqlType, prm.max_length, prm.parameter_id`
    command+=` FROM sys.parameters prm`
    command+=` JOIN sys.procedures sp ON prm.object_id = sp.object_id`
    command+=` JOIN sys.types typ ON prm.user_type_id = typ.user_type_id`
    command+=` WHERE sp.name = @storename`
    command+=` ORDER BY prm.parameter_id;`
    const pool = await poolPromise;
    const result=await pool
    .request()
    .input('storename', sql.VarChar, storename) // Use input parameter for security
    .query(command);
    return result.recordset; // ✅ Return the recordset directly
  } catch (error) {
    console.error('❌ SQL Execution Error', error);
    return [];
  }
}

export default poolPromise; // ✅ default export
