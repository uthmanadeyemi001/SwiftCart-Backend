const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"])
require("dotenv").config();
const Connect = require("./Dbconfig/Db.connect");
const express = require("express");
const cors = require("cors");
const app = express();
const PORT =9000;
const userrouter = require("./Routes/User.routes");
app.use(cors());
app.use(express.json());
app.use("/users", userrouter);
const productRouter = require("./Routes/Product.routes");
app.use("/products", productRouter);
const cartRouter = require("./Routes/Cart.routes");
app.use("/cart", cartRouter);

const orderRouter = require("./Routes/Order.routes");
app.use("/orders", orderRouter);




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

Connect();