const express = require('express');
require('dotenv').config()
const cookieParser = require("cookie-parser");
const { connection } = require('./config/db');
const userRouter = require('./routers/userRouter');
const adminRouter = require('./routers/adminRouter');
const isLoggedIn = require('./middleware/isLoggedIn');


const app = express()
const port = process.env.PORT || 8080

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.static('assets'));
app.use(cookieParser());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);

app.get('/', isLoggedIn, (req, res) => {
    res.render('index');
});

app.get('/register', isLoggedIn, (req, res) => {
    res.render('register');
});

app.listen(port, (error) => {
    if (error) return console.log("Connection error ", error);
    connection()
    console.log(`Your server is running on  http://localhost:${port}`)
})