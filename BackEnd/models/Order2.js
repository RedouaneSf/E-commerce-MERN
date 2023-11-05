const mongoose = require("mongoose");
const Joi = require("joi");

// Comment Schema
const Order2Schema = new mongoose.Schema({
    
    adress: {
        type: String,
        required: true,
    },
    ville: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
const Order2 = mongoose.model("Order2", Order2Schema);

// Validate Create Order
function validateCreateOrder2(obj) {
    const schema = Joi.object({
        
        adress: Joi.string().trim().required().label("adress"),
        ville:Joi.string().trim().required().label("ville"),
        
    
       
    });
    return schema.validate(obj);
}

// Validate Update Order
function validateUpdateOrder2(obj) {
    const schema = Joi.object({
        adress: Joi.string().trim(),
        ville: Joi.string().trim(),
       
        
        
    });
    return schema.validate(obj);
}

module.exports = {
    Order2,
    validateCreateOrder2,
    validateUpdateOrder2,
}