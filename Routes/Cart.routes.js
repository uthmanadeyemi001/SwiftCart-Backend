const express = require('express');
const { addToCart, getCart, updateCartQuantity, removeFromCart } = require("../Controller/Cart.controller");
const authMiddleWare = require("../middleware/auth.middleware");
const cartRouter = express.Router();

// Both viewing and adding to cart require authentication
cartRouter.get("/", authMiddleWare, getCart);
cartRouter.post("/", authMiddleWare, addToCart);
cartRouter.put("/", authMiddleWare, updateCartQuantity);
cartRouter.delete("/:productId", authMiddleWare, removeFromCart);

module.exports = cartRouter;