const mongoose = require("mongoose");
const Joi = require("joi");

// Comment Schema
const Order3Schema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    userId: {
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
const Order3= mongoose.model("Order3", Order3Schema);

// Validate Create Comment
function validateCreateOrder3(obj) {
    const schema = Joi.object({
        userId:Joi.string().required().label("userId"),
        productId: Joi.string().required().label("productId"),
        adress: Joi.string().trim().required().label("adress"),
    });
    return schema.validate(obj);
}

// Validate Update Comment
function validateUpdateOrder3(obj) {
    const schema = Joi.object({
        adress: Joi.string().trim(),
    });
    return schema.validate(obj);
}

module.exports = {
    Order3,
    validateCreateOrder3,
    validateUpdateOrder3,
}