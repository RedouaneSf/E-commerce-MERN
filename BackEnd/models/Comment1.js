const mongoose = require("mongoose");
const Joi = require("joi");

// Comment Schema
const Comment1Schema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

// Comment Model
const Comment1 = mongoose.model("Comment1", Comment1Schema);

// Validate Create Comment
function validateCreateComment1(obj) {
    const schema = Joi.object({
        productId: Joi.string().required().label("productId"),
        text: Joi.string().trim().required().label("Text"),
    });
    return schema.validate(obj);
}

// Validate Update Comment
function validateUpdateComment1(obj) {
    const schema = Joi.object({
        text: Joi.string().trim(),
    });
    return schema.validate(obj);
}

module.exports = {
    Comment1,
    validateCreateComment1,
    validateUpdateComment1,
}