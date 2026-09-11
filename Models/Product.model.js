const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },
    imageUrl: { type: String },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;