const asyncHandler = require("express-async-handler");
const {
  Order3,
  validateCreateOrder3,
  validateUpdateOrder3,
} = require("../models/Order3");
const { User } = require("../models/User");

/**-----------------------------------------------
 * @desc    Create New Comment
 * @route   /api/comments
 * @method  POST
 * @access  private (only logged in user)
 ------------------------------------------------*/
module.exports.createOrder3Ctrl = asyncHandler(async (req, res) => {
  const { error } = validateCreateOrder3(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }



  const order = await Order3.create({
    productId: req.body.productId,
    userId: req.body.userId,
    adress: req.body.adress,
    
  });

  res.status(201).json(order);
});



