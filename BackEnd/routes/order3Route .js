const router = require("express").Router();
const {
  createOrder3Ctrl
} = require("../controllers/order3Controller");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");


// /api/comments
router
  .route("/create")
  .post(createOrder3Ctrl);

module.exports = router;
  