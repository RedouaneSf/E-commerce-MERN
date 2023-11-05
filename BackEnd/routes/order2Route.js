const router = require("express").Router();
const {
  createOrder2Ctrl
} = require("../controllers/order2Controller");
const { verifyTokenAndAdmin,verifyToken } = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");

// /api/categories
router
  .route("/")
  .post(createOrder2Ctrl);
  


  



module.exports = router;