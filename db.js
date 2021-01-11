const Pool = require('pg').Pool

const pool = new Pool({
  user: process.env.DBUSER,
  host: process.env.DBHOST,
  database: process.env.DBDATABASE,
  password: "Sharnigan38",
  port: 5432,
})


pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

module.exports = pool


// To access DB using CMD line
//   - psql -U postgres (sign in as postgres user - pass .env)
//   - \c jobbishtest
