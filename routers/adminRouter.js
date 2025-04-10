const express = require('express');
const { logout } = require('../controllers/authController');
const userModel = require('../models/userModel');
const adminAuth = require('../middleware/adminAuth');
const adminRouter = express.Router();

// Apply adminAuth middleware to all routes in this router
adminRouter.use(adminAuth);

adminRouter.get('/logout', logout);

adminRouter.get('/profile', (req, res) => {
    res.render('admin/profile', { user: req.user });
});

adminRouter.get('/dashboard', async (req, res) => {
    try {
        // get all users except admin
        const users = await userModel.find({ role: 'user' });
        const adminUsers = await userModel.find({ role: 'admin' });

        res.render('admin/dashboard', { user: req.user, users: users, adminUsers: adminUsers});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = adminRouter;