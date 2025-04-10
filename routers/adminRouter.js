const express = require('express');
const { logout } = require('../controllers/authController');
const userModel = require('../models/userModel');
const adminAuth = require('../middleware/adminAuth');
const categoryModel = require('../models/categoryModel');
const { addCategory, getCategories, addProduct, addUser } = require('../controllers/adminController');
const productModel = require('../models/productModel');
const upload = require('../config/multer');
const adminRouter = express.Router();

// Apply adminAuth middleware to all routes in this router
adminRouter.use(adminAuth);

adminRouter.get('/logout', logout);

adminRouter.get('/profile', adminAuth, (req, res) => {
    res.render('admin/profile', { user: req.user });
});

adminRouter.get('/products', adminAuth, async (req, res) => {
    try {
        const products = await productModel.find({}).populate('category');
        const categories = await categoryModel.find({});
        res.render('admin/products', { user: req.user, products: products, categories: categories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

adminRouter.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await userModel.find({});
        res.render('admin/users', { user: req.user, users: users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

adminRouter.get('/addUser', adminAuth, async (req, res) => {
    res.render('admin/addUser', { user: req.user });
});

adminRouter.post('/users/add', adminAuth, upload.single('image'), addUser);

adminRouter.get('/addProduct', adminAuth,async (req, res) => {
    try{
        const categories = await categoryModel.find({});

        res.render('admin/addProduct', { user: req.user, categories: categories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

adminRouter.get('/dashboard', adminAuth,async (req, res) => {
    try {
        // get all users except admin
        const users = await userModel.find({});
        const adminUsers = await userModel.find({ role: 'admin' });
        const categories = await categoryModel.find({});
        const products = await productModel.find({}).populate('category');

        res.render('admin/dashboard', { user: req.user, users: users, adminUsers: adminUsers, categories: categories, products: products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



adminRouter.get('/addCategory', adminAuth, (req, res) => {
    res.render('admin/addCategory', { user: req.user });
});

adminRouter.get('/categories', adminAuth, getCategories);

adminRouter.post('/categories/add', adminAuth, addCategory);

adminRouter.post('/products/add', adminAuth, upload.single('image'), addProduct);

module.exports = adminRouter;