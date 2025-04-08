const express = require('express');
require('dotenv').config()
const cookieParser = require("cookie-parser");
const { connection } = require('./config/db');


const app = express()
const port = process.env.PORT || 8080

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(cookieParser());


app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port, (error) => {
    if (error) return console.log("Connection error ", error);
    connection()
    console.log(`Your server is running on  http://localhost:${port}`)
})