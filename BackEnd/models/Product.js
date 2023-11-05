const mongoose = require('mongoose');

const Joi =  require("joi");


const ProductSchema= mongoose.Schema({
    lib:{
        type:String,
        required:true,
        trim:true,
        minlenght:2,
        maxlenght:100,
    },
    
    qte:{

        type:'number',
        required:true,
        trim:true
        
    },
    prix:{

        type:'number',
        required:true,
        trim:true
        
    },
    category:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
        minlenght:10,
        
    },
    productOwner:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
 },
 likes:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
],
 image: {
    type: Object,
    default: {
        url: "",
        publicId: null,
    }
}


},{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });
//Populate Comment For This Product
ProductSchema.virtual("comments", {
    ref: "Comment1",
    foreignField: "productId",
    localField: "_id"
  });

  //post model

const Product=mongoose.model("Product",ProductSchema);

//validate create post
function validateCreateProduct(obj)
{
    const schema =Joi.object({
        lib: Joi.string().trim().required().min(2).max(200),
        description: Joi.string().trim().required().min(10),
        category: Joi.string().trim().required(),
        qte:Joi.number().integer().required(),
        prix:Joi.number().integer().required(),
    
    });
    return schema.validate(obj);
}

//validate update post
function validateUpdateProduct(obj)
{
    const schema =Joi.object({
        lib: Joi.string().trim().min(2).max(200),
        description: Joi.string().trim().min(10),
        category: Joi.string().trim(),
        qte:Joi.number().integer(),
        prix:Joi.number().integer(),
    
    });
    return schema.validate(obj);
}

module.exports={
    Product,validateCreateProduct,validateUpdateProduct
}