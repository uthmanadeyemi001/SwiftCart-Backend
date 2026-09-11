const express = require("express");
const { checkoutCart, verifyPayment , getUserOrders ,getAllOrders} = require("../Controller/Order.controller");
const authMiddleWare = require("../middleware/auth.middleware");
const isAdmin = require("../middleware/admin.middleware");
const orderRouter = express.Router();

orderRouter.post("/checkout", authMiddleWare, checkoutCart);
orderRouter.get("/verify", verifyPayment);
orderRouter.get("/", authMiddleWare, getUserOrders);
orderRouter.get("/admin/all", authMiddleWare, isAdmin, getAllOrders);

module.exports = orderRouter;