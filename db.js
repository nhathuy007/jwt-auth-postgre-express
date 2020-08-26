require('dotenv').config();
const Pool = require("pg").Pool;

const pool = new Pool({
    user:  'postgres',
    password: '124578',
    database: 'interview',
    host: 'localhost',
    port: 5432
});

module.exports = pool;