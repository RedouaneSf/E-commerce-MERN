const mongoose = require("mongoose");
const Joi = require("joi");

// Comment Schema
const OrderSchema = new mongoose.Schema({
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    adress: {
        type: String,
        required: true,
    },
    
  
    
}, {
    timestamps: true,
});

// Comment Model
const Order = mongoose.model("Order", OrderSchema);



module.exports = {
    Order,
    
}