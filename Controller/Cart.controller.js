const Cart = require("../Models/Cart.model")

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // Comes from authMiddleWare

    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Check if product already exists in cart
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity || 1;
      } else {
        cart.items.push({ productId, quantity: quantity || 1 });
      }
      await cart.save();
      return res.status(200).json({ message: "Cart updated successfully", cart });
    } else {
      const newCart = await Cart.create({
        userId,
        items: [{ productId, quantity: quantity || 1 }]
      });
      return res.status(201).json({ message: "Cart created and item added", cart: newCart });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    return res.status(200).json({ cart });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: "productId and quantity are required" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    
    const updatedCart = await Cart.findOne({ userId }).populate("items.productId");
    return res.status(200).json({ message: "Cart quantity updated", cart: updatedCart });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    
    const updatedCart = await Cart.findOne({ userId }).populate("items.productId");
    return res.status(200).json({ message: "Item removed from cart", cart: updatedCart });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addToCart, getCart, updateCartQuantity, removeFromCart };