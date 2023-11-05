const router = require("express").Router();
const {
  createOrderCtrl,
  getAllOrderCtrl,
  deleteOrderCtrl,
  updateOrderCtrl,
} = require("../controllers/orderController");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");

// /api/comments
router
  .route("/").get(verifyTokenAndAdmin,verifyToken, getAllOrderCtrl);
  //api/create
  router
  .route("/create") .post(verifyToken, createOrderCtrl);


// /api/comments/:id
router.route("/:id")
 .delete(validateObjectId, verifyToken,deleteOrderCtrl)
 .put(validateObjectId, verifyToken, updateOrderCtrl);

module.exports = router;
  
  