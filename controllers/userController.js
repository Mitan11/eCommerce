const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');

const dashboard = async (req, res) => {
    try {
        
        const products = await productModel.find()
            .populate('category')

        const categories = await categoryModel.find()
            .sort({ categoryName: 1 }); 

        res.render('user/dashboard', {
            user: req.user,
            products: products,
            categories: categories
        });
    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).json({ message: error.message });
    }
}

const allProducts = async (req, res) => {
    try {
        const products = await productModel.find({})
            .populate('category')
        const categories = await categoryModel.find({})
        res.render('user/allProducts', {
            user: req.user,
            products: products,
            categories: categories
        });
    } catch (error) {
        console.error('All Products Error:', error);
        res.status(500).json({ message: error.message });
    }
}

const categories = async (req, res) => {
    try {
        const categories = await categoryModel.find({})
        res.render('user/categories', {
            user: req.user,
            categories: categories
        });
    } catch (error) {
        console.error('Category Error:', error);
        res.status(500).json({ message: error.message });
    }
}

const category = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id)
        const products = await productModel.find({ category: category._id })
        res.render('user/category', {
            user: req.user,
            category: category,
            products: products
        });
    } catch (error) {
        console.error('Category Error:', error);
        res.status(500).json({ message: error.message });
    }
}

const profile = async (req, res) => {
    res.render('user/profile', {
        user: req.user
    });
}

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New password and confirm password do not match' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long' });
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({ message: 'New password cannot be the same as the current password' });
        }

        const isMatch = await bcrypt.compare(currentPassword, req.user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        const user = await userModel.findById(req.user._id);

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        res.redirect('/api/v1/user/profile');
    } catch (error) {
        console.error('Change Password Error:', error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    dashboard,
    allProducts,
    categories,
    category,
    profile,
    changePassword
}
