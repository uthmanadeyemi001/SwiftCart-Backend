const mongoose = require("mongoose");
const dotenv = require('dotenv')
const uri = process.env.MONGO_URI // || "mongodb://127.0.0.1:27017/firstdatabase";

const Connect = async () => {
  try {
    const connection = await mongoose.connect(uri);

    if (connection) {
      console.log("database connected successfully");
    }
  } catch (error) {
    console.log(  "Database connection failed", error);
  }
};

module.exports = Connect;