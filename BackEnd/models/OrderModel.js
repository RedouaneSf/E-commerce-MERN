const mongoose = require("mongoose");
const Joi = require("joi");

// Comment Schema
const OrderModelSchema = new mongoose.Schema({
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    shippingInfo: {
     adress:{
        type:String,
        required:true,
     },
     city:{
        type:String,
        required:true,
     },
     zipCode:{
        type:Number,
        required :true,

     }
    },
    orderItems:[
        {
            price:{
                type:Number,
                require:true,
            },
            quantity:{
                type:Number,
                require:true,
            },
            product:{
                type:mongoose.Schema.ObjectId,
                ref:"Product",
                require:true,
            }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    
  
    
}, {
    timestamps: true,
},{
    timestamps:true,
    toJSON:{virtuals : true},
    toObject:{virtuals :true}
});

// Comment Model
const OrderModel = mongoose.model("OrderModel", OrderModelSchema);




module.exports = {
    OrderModel,
  
}