const { Pool } = require('pg');
const express = require('express');
const res = require('express/lib/response');
const { json } = require("body-parser");
const bodyParser = require('body-parser'); 

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

console.log(process.env.DATABASE)

app.get('/db',jsonParser, async (req, res) => {
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
  }); 

  app.post('/register',jsonParser, async(req,res)=>{

    var name = req.body.name; 
    var password = req.body.password; 
    var email = req.body.mail; 

    console.log(name)
    const client = await pool.connect();
     await client.query(  `INSERT INTO "users" ("name", "password", "email")  
    VALUES ($1, $2, $3)`, [name, password,email]);

  
  res.send("1"); 
}); 


  app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });