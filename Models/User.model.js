const mongoose = require("mongoose");

const EcommerceuserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    userName: { type: String, required: true }, 
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" }

});

const usermodel = mongoose.model("User", EcommerceuserSchema); 

module.exports = usermodel;