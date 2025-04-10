const categoryModel = require("../models/categoryModel");
const productModel = require("../models/productModel");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const nodemailer = require("nodemailer");

const addCategory = async (req, res) => {
    try {
        const { categoryName, description } = req.body;

        if (!categoryName || !description) {
            return res.status(400).json({ message: 'Category name and description are required' });
        }

        const existingCategory = await categoryModel.findOne({ categoryName });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = new categoryModel({ categoryName, description });

        await category.save();

        res.redirect('/api/v1/admin/categories');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find({});
        res.render('admin/categories', { user: req.user, categories: categories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const addProduct = async (req, res) => {
    try {
        const { productName, productDescription, productPrice, category, stock } = req.body;
        const image = req.file.filename;
        console.log(productName, productDescription, productPrice, category, stock);

        if (!productName || !productDescription || !productPrice || !category || !stock || !image) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const product = new productModel({ productName, productDescription, productPrice, category, stock, image });

        await product.save();

        res.redirect('/api/v1/admin/products');

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const addUser = async (req, res) => {
    try {
        const { name, email, password, role, sendEmail } = req.body;
        const image = req.file.filename;

        if (!name || !email || !password || !role || !image) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new userModel({ name, email, password: hashedPassword, role, image });
        await user.save();

        if (sendEmail) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Welcome to our website',
                html: `
                    <h1>Welcome to our website</h1>
                    <p>Hello ${name}, welcome to our website</p>
                    <p>Your password is ${password}</p>
                    <p>Please change your password after login</p>
                    <p>Thank you</p>
                `
            }

            await transporter.sendMail(mailOptions);
        }

        res.redirect('/api/v1/admin/users');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    addCategory,
    getCategories,
    addProduct,
    addUser
}
