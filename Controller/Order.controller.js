const Cart = require("../Models/Cart.model");
const Order = require("../Models/Order.model");
const User = require("../Models/User.model");
const axios = require("axios");

const checkoutCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user to ensure email is available for Paystack
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const validItems = cart.items.filter(item => item.productId !== null);
    if (validItems.length === 0) {
      return res.status(400).json({ message: "All items in your cart are no longer available" });
    }

    let totalAmount = 0;
    for (let item of validItems) {
      totalAmount += item.productId.price * item.quantity;
    }

    const order = await Order.create({
      userId,
      items: validItems.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity
      })),
      totalAmount,
      status: "Pending"
    });

    const frontendUrl = process.env.FRONTEND_URL || "https://swift-cart-frontend-indol.vercel.app";

    const paystackResponse = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: user.email,
        amount: totalAmount * 100, 
        callback_url: `${frontendUrl}/order-success`,
        metadata: { orderId: order._id.toString() }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.status(200).json({
      message: "Payment initialized successfully",
      authorization_url: paystackResponse.data.data.authorization_url,
      reference: paystackResponse.data.data.reference,
      order
    });
  } catch (error) {
    console.error("Checkout error:", error.response?.data || error.message);
    return res.status(500).json({ message: "Server error", error: error.response?.data || error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.query;
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
    });

    if (response.data.data.status === "success") {
      const orderId = response.data.data.metadata.orderId;
      const updatedOrder = await Order.findByIdAndUpdate(orderId, { status: "Paid" }, { new: true });
      
      if (updatedOrder) {
        await Cart.findOneAndDelete({ userId: updatedOrder.userId });
      }

      return res.status(200).json({ message: "Payment verified and order updated to Paid" });
    }
    return res.status(400).json({ message: "Payment verification failed" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).populate("items.productId").sort({ createdAt: -1 });
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("userId", "fullName email phoneNumber")
      .populate("items.productId")
      .sort({ createdAt: -1 });
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { checkoutCart, verifyPayment, getUserOrders, getAllOrders };