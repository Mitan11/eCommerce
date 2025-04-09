const express = require('express');
const { register, login } = require('../controllers/userController');

const userRouter = express.Router();


userRouter.post('/register', register);
userRouter.post('/login', login);



userRouter.get('/dashboard', (req, res) => {
    res.render('user/dashboard');
});

module.exports = userRouter;