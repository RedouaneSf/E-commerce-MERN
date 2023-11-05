const mongoose=require("mongoose");
const joi=require("joi");
const jwt = require("jsonwebtoken");
const passwordComplexity = require("joi-password-complexity");

//User Schema
const UserSchema=new mongoose.Schema({

    username:{
        type:String,
        require:true,
        trim:true,
        minlenght:2,
        maxlenght:100,
    },

    password:{
        type:String,
        require:true,
        trim:true,
        minlenght:8,
       
    },

    email:{
        type:String,
        require:true,
        trim:true,
        minlenght:5,
        maxlenght:100,
        unique:true,
    },
    profilePhoto: {
        type: Object,
        default: {
            url: "https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331256_1280.png",
            publicId: null,
        }
    },
    bio: {
        type: String,
    },
    isAdmin: {
        type:Boolean,
        default: false,
    },
    isAccountVerified: {
        type:Boolean,
        default: false,
    },


},{
    timestamps:true,
    toJSON:{virtuals : true},
    toObject:{virtuals :true}
});

//Populate Posts That belongs to this user when he get his profile

UserSchema.virtual("posts",{
    ref:"Post",
    foreignField:"user",
    localField:"_id",
})

//Populate Posts That belongs to this user when he get his profile

UserSchema.virtual("blogs",{
    ref:"Blog",
    foreignField:"user",
    localField:"_id",
})

//generate auth token
UserSchema.methods.generateAuthToken =function(){
  return jwt.sign({id:this._id,isAdmin:this.isAdmin},process.env.JWT_SECRET);
}

//User model
const User= mongoose.model("User",UserSchema);
//Validate Register User
function validateRegisterUser(obj)
{
    const schema=joi.object({
        username:joi.string().min(2).max(100).trim().required(),
        email:joi.string().min(6).max(100).trim().required().email(),
        password:joi.string().max(100).trim().required(),

    })

    return schema.validate(obj);
}

//Validate login User
function validateLoginUser(obj)
{
    const schema=joi.object({
        
        email:joi.string().min(6).max(100).trim().required().email(),
        password:joi.string().max(100).trim().required(),

    })

    return schema.validate(obj);
}

//Validate Update User
function validateUpdateUser(obj)
{
    const schema=joi.object({
        username:joi.string().max(100).trim(),
        email:joi.string().min(6).max(100).trim().email(),
        password:joi.string().max(100).trim(),

    })

    return schema.validate(obj);
}


// Validate Email
function validateEmail(obj) {
    const schema = joi.object({
        email: joi.string().trim().min(5).max(100).required().email(),
    });
    return schema.validate(obj);
}

// Validate New Password
function validateNewPassword(obj) {
    const schema = joi.object({
        password: joi.string().max(100).trim(),
    });
    return schema.validate(obj);
}


module.exports={
    User,
    validateRegisterUser,
    validateLoginUser,
    validateUpdateUser,
    validateEmail,
    validateNewPassword
}