const express = require('express');
const { register, login, logout } = require('../controllers/userController');
const auth = require('../middleware/auth');

const userRouter = express.Router();


userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/logout', logout);



userRouter.get('/dashboard', auth, (req, res) => {
    res.render('user/dashboard', { user: req.user });
});

module.exports = userRouter;