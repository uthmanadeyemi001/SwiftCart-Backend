const Product = require("../Models/Product.model");
const getAllProducts = async (_req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// const createProduct = async (req, res) => {
//   try {
//     const { title, description, price, category, stock, imageUrl } = req.body;
//     const newProduct = await Product.create({
//       title,
//       description,
//       price,
//       category,
//       stock,
//       imageUrl,
//     });
//     return res.status(201).json({ message: "Product created successfully", product: newProduct });
//   } catch (error) {
//     return res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, stock } = req.body;
    
    // Cloudinary automatically provides the secure URL in req.file.path
    const imageUrl = req.file ? req.file.path : '';

    const newProduct = await Product.create({
      title,
      description,
      price: Number(price),
      category,
      stock: Number(stock || 0),
      imageUrl,
    });

    return res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getAllProducts, createProduct,deleteProduct };