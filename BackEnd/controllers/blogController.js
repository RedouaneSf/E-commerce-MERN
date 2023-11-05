const asyncHandler = require("express-async-handler");
const {
  Blog,
  
} = require("../models/Blog");
const { User } = require("../models/User");
const { Product } = require("../models/Product");


/**-----------------------------------------------
 * @desc    Create New Comment
 * @route   /api/comments
 * @method  POST
 * @access  private (only logged in user)
 ------------------------------------------------*/
module.exports.createBlogCtrl = asyncHandler(async (req, res) => {
 

  const profile = await User.findById(req.user.id);
   
  const {orderItems,orderStatus}=req.body;

  const blog = await Blog.create({
    
    ville: req.body.ville,
    codePostal:req.body.codePostal,
    adress: req.body.adress,
    total_ttc:req.body.total_ttc,
    username: profile.username,
    user: req.user.id,
    orderStatus,
    orderItems
    
    
    
    
  });

  res.status(201).json(blog);
});


//////////////////////////////////////////////////
/**-----------------------------------------------
 * @desc    Get All blogs
 * @route   /api/orders
 * @method  GET
 * @access  private (only admin)
 ------------------------------------------------*/
 module.exports.getAllblogCtrl = asyncHandler(async (req, res) => {
  const blogs = await Blog.find();
  res.status(200).json(blogs);
});
//////////////////////////////////////////////////
/////////////////////////////////////////
/**-----------------------------------------------
 * @desc    Get blogs Count
 * @route   /api/blogs/count
 * @method  GET
 * @access  public
 ------------------------------------------------*/
 module.exports.getBlogsCountCtrl = asyncHandler(async (req, res) => {
  const count = await Blog.count();
  res.status(200).json(count);
});
///////////////////////////////////////////////////
////////////////////////////////////////
/**-----------------------------------------------
 * @desc    Get single blog
 * @route   /api/blog/:id
 * @method  GET
 * @access  public
 ------------------------------------------------*/

 module.exports.getSingleBlogCtrl = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  .populate("user", ["-password"]);
  
  
  
  if (!blog) {
    return res.status(404).json({ message: "post not found" });
  }

  res.status(200).json(blog);
});


/**-----------------------------------------------
 * @desc    Update User Profile
 * @route   /api/users/profile/:id
 * @method  PUT
 * @access  private (only user himself)
 ------------------------------------------------*/
 module.exports.updateBlogCtrl = asyncHandler(async (req, res) => {
 
  

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        orderStatus: req.body.orderStatus
   
        
      },
    },
    { new: true }
  );
  

  res.status(200).json(updatedBlog);
});
///////////////////////////////////