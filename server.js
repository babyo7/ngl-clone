const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const router = require('./routes/router')
const dotenv = require('dotenv').config()

app.use(express.static('public'))
app.set('view engine','ejs')
app.use(bodyParser.json());

app.use(router)

app.listen(3000 ,()=>{
console.log(`http://localhost:3000`);
})