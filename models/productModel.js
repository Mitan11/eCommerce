const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productDescription: {
        type: String,
        required: true,
    },
    productPrice: {
        type: String,
        required: true
    },
    image: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    stock: { type: Number, required: true, default: 0 },
});

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;
