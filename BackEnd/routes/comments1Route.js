const router = require("express").Router();
const {
  createComment1Ctrl,
  getAllComments1Ctrl,
  deleteComment1Ctrl,
  updateComment1Ctrl,
} = require("../controllers/comments1Controller");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");

// /api/comments
router
  .route("/")
  .post(verifyToken, createComment1Ctrl)
  .get(verifyTokenAndAdmin, getAllComments1Ctrl);
 


// /api/comments/:id
router.route("/:id")
 .delete(validateObjectId, verifyToken, deleteComment1Ctrl)
 .put(validateObjectId, verifyToken, updateComment1Ctrl);

module.exports = router;
  