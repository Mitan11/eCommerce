const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { dashboard } = require('../controllers/userController');

const userRouter = express.Router();


userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/logout', logout);



userRouter.get('/dashboard', auth, dashboard);

module.exports = userRouter;