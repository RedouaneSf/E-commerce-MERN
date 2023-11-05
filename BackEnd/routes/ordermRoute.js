const router = require("express").Router();
const {
  newOrder
} = require("../controllers/ordermController");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");


// /api/comments
router
  .route("/create")
  .post(verifyToken,newOrder);

module.exports = router;
  