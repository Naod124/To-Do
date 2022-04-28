const { Pool } = require('pg');
const express = require('express')
const app = express()
require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
 ssl: true,
  user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE, 
    host: process.env.HOST,
    port: process.env.PORT
});

console.log(process.env.DATABASE)

app.get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM users');
      const results = { 'results': (result) ? result.rows : null};
      res.send( results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

  app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });