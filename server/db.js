const Pool = require('pg').Pool;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PW || 'endorphins',
  host: process.env.DB_HOST || '3.101.61.193',
  port: process.env.DB_PORT || '5432',
  database: process.env.DB_NAME || 'sdc_lw'
});

module.exports = pool;