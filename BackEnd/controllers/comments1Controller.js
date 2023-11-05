const asyncHandler = require("express-async-handler");
const {
  Comment1,
  validateCreateComment1,
  validateUpdateComment1,
} = require("../models/Comment1");
const { User } = require("../models/User");

/**-----------------------------------------------
 * @desc    Create New Comment
 * @route   /api/comments
 * @method  POST
 * @access  private (only logged in user)
 ------------------------------------------------*/
module.exports.createComment1Ctrl = asyncHandler(async (req, res) => {
  const { error } = validateCreateComment1(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const profile = await User.findById(req.user.id);

  const comment = await Comment1.create({
    productId: req.body.productId,
    text: req.body.text,
    user: req.user.id,
    username: profile.username,
  });

  res.status(201).json(comment);
});

/**-----------------------------------------------
 * @desc    Get All Comments
 * @route   /api/comments
 * @method  GET
 * @access  private (only admin)
 ------------------------------------------------*/
module.exports.getAllComments1Ctrl = asyncHandler(async (req, res) => {
  const comments = await Comment1.find().populate("user");
  res.status(200).json(comments);
});

/**-----------------------------------------------
 * @desc    Delete Comment
 * @route   /api/comments/:id
 * @method  DELETE
 * @access  private (only admin or owner of the comment)
 ------------------------------------------------*/
module.exports.deleteComment1Ctrl = asyncHandler(async (req, res) => {
  const comment = await Comment1.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({ message: "comment not found" });
  }

  if (req.user.isAdmin || req.user.id === comment.user.toString()) {
    await Comment1.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "comment has been deleted" });
  } else {
    res.status(403).json({ message: "access denied, not allowed" });
  }
});

/**-----------------------------------------------
 * @desc    Update Comment
 * @route   /api/comments/:id
 * @method  PUT
 * @access  private (only owner of the comment)
 ------------------------------------------------*/
 module.exports.updateComment1Ctrl = asyncHandler(async (req, res) => {
  const { error } = validateUpdateComment1(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const comment = await Comment1.findById(req.params.id);
  if(!comment) {
    return res.status(404).json({ message: "comment not found" });
  }
  
  if(req.user.id !== comment.user.toString()) {
    return res.status(403)
      .json({ message: "access denied, only user himself can edit his comment" });
  }

  const updatedComment = await Comment1.findByIdAndUpdate(req.params.id, {
    $set: {
      text: req.body.text,
    }
  }, { new : true });
  
  res.status(200).json(updatedComment);
});
