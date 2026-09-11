const express = require('express');
const { getAllProducts, createProduct, deleteProduct } = require("../Controller/Product.controller");
const authMiddleWare = require("../middleware/auth.middleware");
const isAdmin = require("../middleware/admin.middleware");
const upload = require("../middleware/upload.middleware"); // Import multer upload
const productRouter = express.Router();

productRouter.get("/", getAllProducts); 
productRouter.post("/", authMiddleWare, isAdmin, upload.single('image'), createProduct); // Added upload middleware
productRouter.delete("/:id", authMiddleWare, isAdmin, deleteProduct);

module.exports = productRouter;