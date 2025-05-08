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

export async function SqlExec(command: string) {
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
    return error;
  }
}

export default poolPromise; // ✅ default export
