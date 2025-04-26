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

export default poolPromise; // ✅ default export
