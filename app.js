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

app.get('/notebyEmail',jsonParser, async(req,res)=>{
  try{
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM notes where fk_email = "+"'lidiaabraham0@gmail.com'");
    const results = { 'results': (result) ? result.rows : null};
    res.send(results);
    client.release();
  }catch(err){
    console.error(err);
    res.send("Error" + err);
  }
});


app.post('/saveNote',jsonParser, async(req,res)=>{
  //var noteid= req.body.noteid;
  var title = req.body.title; 
  console.log(title)
  var fk_email = 'lidiaabraham0@gmail.com';

  //console.log(noteid + " " + description); 

  const client = await pool.connect();
    await client.query(  `INSERT INTO "notes" ("title", "fk_email")  
    VALUES ($1, $2)`, [title,fk_email]);

    res.send("1"); 
});


app.delete('/delete',jsonParser,async(req,res)=>{
  try{
    const client = await pool.connect();
    res = await client.query('DELETE FROM notes where fk_email = '+'"'+req.email+'"');
    res.send("1"); 
    client.release();
  }catch(err){
    console.error(err);
    res.send("Error" + err); 
  }
    
});

app.put('/update',jsonParser,async(req,res)=>{ 
  try{
    const client = await pool.connect();
    res = await client.query('UPDATE notes set title = '+'"'+title+'", description = '+'"'+description+'", created_on = Date().toISOString() , fk_email = '+'"lidiaabraham0@gmail.com" where noteid = '+'"'+req.noteid+'"');
    res.send("1"); 
    client.release();
  }catch(err){
    console.error(err);
    res.send("Error" + err);
  }
    
});


  app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });