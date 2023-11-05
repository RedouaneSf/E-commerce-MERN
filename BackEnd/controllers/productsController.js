const fs=require("fs");
const path=require("path");
const asyncHandler=require("express-async-handler");
const{Product,validateCreateProduct,validateUpdateProduct}=require("../models/Product");


const {cloudinaryUploadImage,cloudinaryRemoveImage}=require("../utils/cloudinary");
const { Comment1 } = require("../models/Comment1");

/**-----------------------------------------------
 * @desc    Create Product
 * @route   /api/products
 * @method  POST
 * @access  private (only admin)
 ------------------------------------------------*/

 module.exports.createProductCtrl = asyncHandler(async (req, res) => {
  // 1. Validation for image
  if (!req.file) {
    return res.status(400).json({ message: "no image provided" });
  }

  // 2. Validation for data
  const { error } = validateCreateProduct(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // 3. Upload photo
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  // 4. Create new post and save it to DB
  const product = await Product.create({
    lib: req.body.lib,
    description: req.body.description,
    category: req.body.category,
    qte:req.body.qte,
    prix:req.body.prix,
    productOwner: req.user.id,
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });

  // 5. Send response to the client
  res.status(201).json(product);

  // 6. Remove image from the server
  fs.unlinkSync(imagePath);
});
////////////////////////////////////////
////////////////////////////////////////
/**-----------------------------------------------
 * @desc    Get all post
 * @route   /api/posts
 * @method  GET
 * @access  public
 ------------------------------------------------*/

 module.exports.getAllProductCtrl = asyncHandler(async (req, res) => {
  const PRODUCT_PER_PAGE = 4;
  const { pageNumber, category } = req.query;
  let products;

  if (pageNumber) {
    products = await Product.find()
      .skip((pageNumber - 1) * PRODUCT_PER_PAGE)
      .limit(PRODUCT_PER_PAGE)
      .sort({ createdAt: -1 })
      .populate("productOwner", ["-password"]);
  } else if (category) {
    products  = await Product.find({ category })
      .sort({ createdAt: -1 })
      .populate("productOwner", ["-password"]);
  } else {
    products  = await Product.find()
      .sort({ createdAt: -1 })
      .populate("productOwner", ["-password"]);
  }
  res.status(200).json(products);
});

////////////////////////////////////////
/**-----------------------------------------------
 * @desc    Get single post
 * @route   /api/posts/:id
 * @method  GET
 * @access  public
 ------------------------------------------------*/

 module.exports.getSingleProductCtrl = asyncHandler(async (req, res) => {
  const products = await Product.findById(req.params.id)
  .populate("productOwner", ["-password"])
  .populate("comments");
  
  
  if (!products ) {
    return res.status(404).json({ message: "post not found" });
  }

  res.status(200).json(products );
});
/////////////////////////////////////////
/**-----------------------------------------------
 * @desc    Get Posts Count
 * @route   /api/posts/count
 * @method  GET
 * @access  public
 ------------------------------------------------*/
 module.exports.getProductCountCtrl = asyncHandler(async (req, res) => {
  const count = await Product.count();
  res.status(200).json(count);
});
/**-----------------------------------------------
 * @desc    Delete Post
 * @route   /api/posts/:id
 * @method  DELETE
 * @access  private (only admin or owner of the post)
 ------------------------------------------------*/
 module.exports.deleteProductCtrl = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "product not found" });
  }

  if (req.user.isAdmin) {
    await Product.findByIdAndDelete(req.params.id);
    await cloudinaryRemoveImage(product.image.publicId);

     // Delete all comments that belong to this post
     await Comment1.deleteMany({ productId: product._id });

    res.status(200).json({
      message: "product has been deleted successfully",
      productId: product._id,
    });
  } else {
    res.status(403).json({ message: "access denied, forbidden" });
  }
});
/////////////////////////////////////
/**-----------------------------------------------
 * @desc    Update Post
 * @route   /api/posts/:id
 * @method  PUT
 * @access  private (only owner of the post)
 ------------------------------------------------*/
 module.exports.updateProductCtrl = asyncHandler(async (req, res) => {
  // 1. Validation
  const { error } = validateUpdateProduct(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // 2. Get the post from DB and check if post exist
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "post not found" });
  }

  // 3. check if this post belong to logged in user
  if (req.user.id !== product.productOwner.toString()) {
    return res
      .status(403)
      .json({ message: "access denied, you are not allowed" });
  }

  // 4. Update post
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        lib: req.body.lib,
        description: req.body.description,
        category: req.body.category,
        qte:req.body.qte,
        prix:req.body.prix,
      },
    },
    { new: true }
  ).populate("productOwner", ["-password"]);
 

  // 5. Send response to the client
  res.status(200).json(updatedProduct );
});
////////////////////////////////////////
/**-----------------------------------------------
 * @desc    Update Post Image
 * @route   /api/posts/upload-image/:id
 * @method  PUT
 * @access  private (only owner of the post)
 ------------------------------------------------*/
 module.exports.updateProductImageCtrl = asyncHandler(async (req, res) => {
  // 1. Validation
  if (!req.file) {
    return res.status(400).json({ message: "no image provided" });
  }

  // 2. Get the post from DB and check if post exist
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "post not found" });
  }

  // 3. Check if this post belong to logged in user
  if (req.user.id !== product.productOwner.toString()) {
    return res
      .status(403)
      .json({ message: "access denied, you are not allowed" });
  }

  // 4. Delete the old image
  await cloudinaryRemoveImage(product .image.publicId);

  // 5. Upload new photo
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  // 6. Update the image field in the db
  const updatedProduct= await Product.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        image: {
          url: result.secure_url,
          publicId: result.public_id,
        },
      },
    },
    { new: true }
  );

  // 7. Send response to client
  res.status(200).json(updatedProduct);

  // 8. Remvoe image from the server
  fs.unlinkSync(imagePath);
});
////////////////////////////////////////
/**-----------------------------------------------
 * @desc    Toggle Like
 * @route   /api/posts/upload-image/:id
 * @method  PUT
 * @access  private (only logged in user)
 ------------------------------------------------*/
 module.exports.toggleLikeCntrl=asyncHandler(async(req,res)=>{
   const LoggedInUser=req.user.id;
   const {id:productId}=req.params;
  let product = await Product.findById(productId);
  if(!product )
  {
    return res.status(404).json({message :"not found"});
  }
  const isPostAlreadyLiked=product.likes.find((user)=>user.toString()===LoggedInUser);

  if(isPostAlreadyLiked)
  {
    product=await Product.findByIdAndUpdate(productId,{
      $pull:{likes:LoggedInUser}
    },{new : true});
  } else
  {
    product=await Product.findByIdAndUpdate(productId,{
      $push:{likes:LoggedInUser}
    },{new : true});
  }

  return res.status(200).json(product);
 });