const router= require("express").Router();
const photoUpload=require("../middlewares/photoUpload");
const {verifyToken,verifyTokenAndAdmin}=require("../middlewares/verifyToken");
const  {createProductCtrl,toggleLikeCntrl,updateProductImageCtrl,updateProductCtrl,deleteProductCtrl,
  getProductCountCtrl,getSingleProductCtrl ,getAllProductCtrl 
}=require("../controllers/productsController");
const validateObjectId=require("../middlewares/validateObjectId");

///api/posts

router.route("/").post(verifyTokenAndAdmin,photoUpload.single("image"),createProductCtrl).get(getAllProductCtrl );


// /api/posts/count
router.route("/count").get(getProductCountCtrl);
///api/posts/:id
router
  .route("/:id")
  .get(validateObjectId, getSingleProductCtrl)
  .delete(validateObjectId, verifyTokenAndAdmin, deleteProductCtrl)
  .put(validateObjectId, verifyTokenAndAdmin, updateProductCtrl);

    // /api/posts/update-image/:id
router.route("/update-image/:id")
.put(validateObjectId, verifyTokenAndAdmin, photoUpload.single("image"), updateProductImageCtrl);

//api/post/like/:id
router.route("/like/:id").put(validateObjectId,verifyToken,toggleLikeCntrl)
  
  module.exports=router;