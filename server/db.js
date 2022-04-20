const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  password: 'endorphins',
  host: 'localhost',
  port: '5432',
  database: 'sdc_lw'
});

module.exports = pool;