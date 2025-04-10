const express = require('express');
const auth = require('../middleware/auth');
const { logout } = require('../controllers/authController');

const adminRouter = express.Router();


adminRouter.get('/logout', logout)

adminRouter.get('/dashboard', auth, (req, res) => {
    res.render('admin/dashboard', { user: req.user });
})

module.exports = adminRouter;