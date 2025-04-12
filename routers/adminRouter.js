const express = require('express');
const { logout } = require('../controllers/authController');
const adminAuth = require('../middleware/adminAuth');
const { addCategory, getCategories, addProduct, addUser, profile, products, users, addUserForm, addProductForm, dashboard, addCategoryForm, deleteProduct, editProduct, updateProduct, editCategory, updateCategory, deleteCategory, deleteUser, editUser, updateUser, getProductsByCategory, updateProfile, updatePassword } = require('../controllers/adminController');
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

adminRouter.post('/product/delete/:id', adminAuth, deleteProduct);

adminRouter.get('/product/edit/:id', adminAuth, editProduct);

adminRouter.post('/product/update/:id', adminAuth, upload.single('image'), updateProduct);

adminRouter.get('/category/edit/:id', adminAuth, editCategory);

adminRouter.post('/category/update/:id', adminAuth, updateCategory);

adminRouter.post('/category/delete/:id', adminAuth, deleteCategory);

adminRouter.post('/user/delete/:id', adminAuth, deleteUser);

adminRouter.get('/user/edit/:id', adminAuth, editUser);

adminRouter.post('/user/update/:id', adminAuth, upload.single('image'), updateUser);

adminRouter.get('/category/products/:id', adminAuth, getProductsByCategory);

adminRouter.post('/profile/update', adminAuth, updateProfile);

adminRouter.post('/profile/password', adminAuth, updatePassword);

module.exports = adminRouter;