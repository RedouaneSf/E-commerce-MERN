const asyncHandler = require("express-async-handler");
const {
  OrderModel,
  validateCreateOrderModel,
  validateUpdateOrderModel,
} = require("../models/OrderModel");
const { User } = require("../models/User");

/**-----------------------------------------------
 * @desc    Create New Order
 * @route   /api/orders
 * @method  POST
 * @access  private (only logged in user)
 ------------------------------------------------*/
exports.newOrder = asyncHandler(async (req, res,next) => {
  
   const { shippingInfo,orderItems}=req.body;
  const profile = await User.findById(req.user.id);

  const order = await OrderModel.create({
    
    shippingInfo,
    orderItems,
    user: req.user.id,
   
    
  });

  res.status(201).json(order);
});
 

