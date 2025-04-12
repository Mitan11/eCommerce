const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");

const dashboard = async (req, res) => {
    try {
        // Fetch all products with their categories
        const products = await productModel.find()
            .populate('category')

        // Fetch all categories
        const categories = await categoryModel.find()
            .sort({ categoryName: 1 }); // Sort alphabetically

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

module.exports = {
    dashboard
}
