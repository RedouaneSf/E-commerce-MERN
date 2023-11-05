 const asyncHandler =require("express-async-handler");
const {User,validateUpdateUser} =require("../models/User");
const bcrypt=require("bcryptjs");
const path = require("path");
const {cloudinaryUploadImage,cloudinaryRemoveImage}=require("../utils/cloudinary");
const fs= require("fs");
const { Comment } = require("../models/Comment");
const { Post } = require("../models/Post");
const { Blog } = require("../models/Blog");

/**-----------------------------------------------
 * @desc    Get All Users Profile
 * @route   /api/users/profile
 * @method  GET
 * @access  private (only admin)
 ------------------------------------------------*/
 module.exports.getAllUsersCtrl = asyncHandler(async (req, res) => {
  const users = await User.find().populate("posts");
  res.status(200).json(users);
 
});

///////////////////////////////////////////////
/**-----------------------------------------------
 * @desc    Get  UserProfile
 * @route   /api/users/profile/:id
 * @method  GET
 * @access  public 
 ------------------------------------------------*/
 module.exports.getUsersProfileCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password").populate("blogs");
  if(!user)
  {
    res.status(404).json({message:"not found!!"})
  }
  res.status(200).json(user);
 
});
////////////////////////////////////////////////////


 /**-----------------------------------------------
 * @desc    Update User Profile
 * @route   /api/users/profile/:id
 * @method  PUT
 * @access  private (only user himself)
 ------------------------------------------------*/
module.exports.updateUserProfileCtrl = asyncHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        password: req.body.password
        
      },
    },
    { new: true }
  ).select("-password").populate("posts");
  

  res.status(200).json(updatedUser);
});
///////////////////////////////////
/**-----------------------------------------------
 * @desc    Get  Users Count
 * @route   /api/users/Count
 * @method  GET
 * @access  private (only admin)
 ------------------------------------------------*/
 module.exports.getUsersCountCtrl = asyncHandler(async (req, res) => {
  const count = await User.count();
  res.status(200).json(`number of users ${count}`);
 
});
////////////////////////////////////
/**-----------------------------------------------
 * @desc     Profile photo upload
 * @route   /api/users/profile/profile-photo-upload
 * @method  POST
 * @access  private (only login admin)
 ------------------------------------------------*/
 module.exports.profilePhotoUploadCtrl= asyncHandler(async(req,res)=>{
  //validation
  if(!req.file)
  {
    return res.status(400).json({message:"no file found"});
  }
  //get the path to the image
   const imagePath=path.join(__dirname,`../images/${req.file.filename}`);
  //upload to cloudinary
    const result = await cloudinaryUploadImage(imagePath);
   
  //get the user from the db
  const user = await User.findById(req.user.id);
  //delete old profile photo
  if (user.profilePhoto?.publicId !== null) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }

  //change the profile fileld in the db
  user.profilePhoto = {
    url: result.secure_url,
    publicId: result.public_id,
  };
  res.status(200).json({
    message: "your profile photo uploaded successfully",
    profilePhoto: { url: result.secure_url, publicId: result.public_id },
  });

  //remove image from the server

   fs.unlinkSync(imagePath);

 });
 ///////////////////////////////////////////
 /**-----------------------------------------------
 * @desc    Delete User Profile
 * @route   /api/users/profile/:id
 * @method  DELETE
 * @access  private (only admin or user himself)
 ------------------------------------------------*/

 module.exports.deleteUserProfileCtrl=asyncHandler(async(req,res)=>{
 //1-get user from db
   const user= await User.findById(req.params.id);
   if(!user)
   {
     return res.status(404).json({message:"user not found"});
   }
 //2-get all post from db
 const posts = await Post.find({ user: user._id });
 //3-get the public id from  the post
 const publicIds = posts?.map((post) => post.image.publicId);
 //4-delete all post image from cloudinary 
 if(publicIds?.length > 0) {
  await cloudinaryRemoveMultipleImage(publicIds);
}
 //5-delete profile pic from cloudinary

 if(user.profilePhoto.publicId !== null) {
  await cloudinaryRemoveImage(user.profilePhoto.publicId);
}

 //6-user post and comment
 await Post.deleteMany({ user: user._id });
 await Comment.deleteMany({ user: user._id });

 //delete user 
 await User.findByIdAndDelete(req.params.id);

 //send response to the client
   res.status(200).json({message:"your profile has been deleted"});

 });
/////////////////////////////
module.exports.payment=async(req,res)=>{

  try {
    
    const {cart,nonce}=req.body; 
    const blog= new Blog({
      products:cart,
      text:req.body.text,
      user: req.user.id,
    }).save()
    return res.json(blog)
    
  } catch (error) {
    
     console.log(error);
  }
};
