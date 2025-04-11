const express = require('express');
const { logout } = require('../controllers/authController');
const adminAuth = require('../middleware/adminAuth');
const { addCategory, getCategories, addProduct, addUser, profile, products, users, addUserForm, addProductForm, dashboard, addCategoryForm } = require('../controllers/adminController');
const upload = require('../config/multer');
const adminRouter = express.Router();

// Apply adminAuth middleware to all routes in this router
adminRouter.use(adminAuth);

adminRouter.get('/logout', logout);

adminRouter.get('/profile', adminAuth, profile);

adminRouter.get('/products', adminAuth, products);

adminRouter.get('/users', adminAuth, users);

adminRouter.get('/addUser', adminAuth, addUserForm);

adminRouter.post('/users/add', adminAuth, upload.single('image'), addUser);

adminRouter.get('/addProduct', adminAuth, addProductForm);

adminRouter.get('/dashboard', adminAuth, dashboard);

adminRouter.get('/addCategory', adminAuth, addCategoryForm);

adminRouter.get('/categories', adminAuth, getCategories);

adminRouter.post('/categories/add', adminAuth, addCategory);

adminRouter.post('/products/add', adminAuth, upload.single('image'), addProduct);

module.exports = adminRouter;