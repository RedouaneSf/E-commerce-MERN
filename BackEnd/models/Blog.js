const mongoose = require("mongoose");
const Joi = require("joi");

// Comment Schema
const BlogSchema = new mongoose.Schema({
    
 
   
    
    adress: {
        type: String,
        required: true,
    },
    ville: {
        type: String,
        required: true,
    },
    codePostal: {
        type: String,
        required: true,
    },
    
    orderStatus:{
        type:String,
        required:true,
        enum:['Processing','Shipped','Delivered','Cancel'],
        default:'Processing'
    },
    username: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
   
    orderItems:[
        {
            lib:{
                type: String,
                required: true,
            },
            image: {
                type: Object,
                default: {
                    url: "",
                    publicId: null,
                }
            },
            prix:{
                type:Number,
                require:true,
            },
            qte:{
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
    total_ttc:{
        type:Number,
        require:true,
    },
    
  
    
}, {
    timestamps: true,
});

// Comment Model
const Blog = mongoose.model("Blog", BlogSchema);



module.exports = {
    Blog,
    
}