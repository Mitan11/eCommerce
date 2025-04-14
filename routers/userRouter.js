const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { dashboard, allProducts, categories, category, profile, changePassword } = require('../controllers/userController');

const userRouter = express.Router();


userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/logout', logout);



userRouter.get('/dashboard', auth, dashboard);

userRouter.get('/all-products', auth, allProducts);

userRouter.get('/categories', auth, categories);

userRouter.get('/category/:id', auth, category);

userRouter.get('/profile', auth, profile);

userRouter.post('/profile/password', auth, changePassword);

module.exports = userRouter;