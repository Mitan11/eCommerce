const categoryModel = require("../models/categoryModel");
const productModel = require("../models/productModel");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const nodemailer = require("nodemailer");

const profile = (req, res) => {
    res.render('admin/profile', { user: req.user });
}

const products = async (req, res) => {
    try {
        const products = await productModel.find({}).populate('category');
        const categories = await categoryModel.find({});
        res.render('admin/products', { user: req.user, products: products, categories: categories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const users = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.render('admin/users', { user: req.user, users: users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const addUserForm = async (req, res) => {
    res.render('admin/addUser', { user: req.user });
}

const addProductForm = async (req, res) => {
    try {
        const categories = await categoryModel.find({});

        res.render('admin/addProduct', { user: req.user, categories: categories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const dashboard = async (req, res) => {
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
}

const addCategoryForm = (req, res) => {
    res.render('admin/addCategory', { user: req.user });
}

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

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        await productModel.findByIdAndDelete(id);

        res.redirect('/api/v1/admin/products');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        const categories = await categoryModel.find({});
        res.render('admin/editProduct', { user: req.user, product: product, categories: categories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { productName, productDescription, productPrice, category, stock } = req.body;

        // Create update object with required fields
        const updateData = { productName, productDescription, productPrice, category, stock };

        // Only update image if a new one was uploaded
        if (req.file && req.file.filename) {
            updateData.image = req.file.filename;
        }

        // Update the product
        await productModel.findByIdAndUpdate(id, updateData);

        res.redirect('/api/v1/admin/products');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const editCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.findById(id);
        res.render('admin/editCategory', { user: req.user, category: category });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryName, description } = req.body;

        if (!categoryName || !description) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const updateData = {
            categoryName,
            description,
        };

        await categoryModel.findByIdAndUpdate(id, updateData);

        res.redirect('/api/v1/admin/categories');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.redirect('/api/v1/admin/categories');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await userModel.findByIdAndDelete(id);
        res.redirect('/api/v1/admin/users');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        res.render('admin/editUser', { user: req.user, user: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const updateData = { name, email, password: hashedPassword, role };

        if (req.file && req.file.filename) {
            updateData.image = req.file.filename;
        }

        await userModel.findByIdAndUpdate(id, updateData);
        res.redirect('/api/v1/admin/users');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getProductsByCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.findById(id);
        const products = await productModel.find({ category: id });
        res.render('admin/productsByCategory', { user: req.user, products: products, category: category });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        await userModel.findByIdAndUpdate(req.user._id, { name, email });
        res.redirect('/api/v1/admin/profile');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New password and confirm password do not match' });
        }


        if (currentPassword === newPassword) {
            return res.status(400).json({ message: 'New password cannot be the same as the current password' });
        }

        const user = await userModel.findById(req.user._id);
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await userModel.findByIdAndUpdate(req.user._id, { password: hashedPassword });
        res.redirect('/api/v1/admin/profile');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    addCategory,
    getCategories,
    addProduct,
    addUser,
    profile,
    products,
    users,
    addUserForm,
    addProductForm,
    dashboard,
    addCategoryForm,
    deleteProduct,
    editProduct,
    updateProduct,
    editCategory,
    updateCategory,
    deleteCategory,
    deleteUser,
    editUser,
    updateUser,
    getProductsByCategory,
    updateProfile,
    updatePassword
}
