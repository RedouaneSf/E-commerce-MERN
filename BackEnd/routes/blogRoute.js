const router = require("express").Router();
const {
  createBlogCtrl,
  getAllblogCtrl,
  getBlogsCountCtrl,
  getSingleBlogCtrl,
  updateBlogCtrl
} = require("../controllers/blogController");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");


// /api/blogs
router
  .route("/")
  .post(verifyToken,createBlogCtrl);

 ////////////////////////

 router.route("/").get(getAllblogCtrl)

  //
  // /api/blogs/count
router.route("/count").get(getBlogsCountCtrl);
///////////////////////////////
///api/blogs/:id
router
  .route("/:id")
  .get(getSingleBlogCtrl)
///api/blogs/:id
router
.route("/:id")
.put(verifyToken,updateBlogCtrl)

module.exports = router;
  