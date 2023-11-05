const asyncHandler = require("express-async-handler");
const {
  Order,
  validateCreateOrder,
  validateUpdateOrder,
} = require("../models/Order");
const { User } = require("../models/User");

module.exports.createOrderCtrl = asyncHandler(async (req, res) => {
 

  
   
  

  const order = await Order.create({
    
    
    adress: req.body.adress,
    
    
    
    
    
  });

  res.status(201).json(order);
});

/**-----------------------------------------------
 * @desc    Get All Orders
 * @route   /api/orders
 * @method  GET
 * @access  private (only admin)
 ------------------------------------------------*/
module.exports.getAllOrderCtrl = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user");
  res.status(200).json(orders );
});

/**-----------------------------------------------
 * @desc    Delete Order
 * @route   /api/orders/:id
 * @method  DELETE
 * @access  private (only admin or owner )
 ------------------------------------------------*/
module.exports.deleteOrderCtrl = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order ) {
    return res.status(404).json({ message: "order not found" });
  }

  if (req.user.isAdmin || req.user.id === order.user.toString()) {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "order has been deleted" });
  } else {
    res.status(403).json({ message: "access denied, not allowed" });
  }
});

/**-----------------------------------------------
 * @desc    Update Order
 * @route   /api/orders/:id
 * @method  PUT
 * @access  private (only owner of the order)
 ------------------------------------------------*/
 module.exports.updateOrderCtrl = asyncHandler(async (req, res) => {
  const { error } = validateUpdateOrder(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const order = await Order.findById(req.params.id);
  if(!order) {
    return res.status(404).json({ message: "order not found" });
  }
  
  if(req.user.id !== order.user.toString()) {
    return res.status(403)
      .json({ message: "access denied" });
  }

  const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
    $set: {
      adress: req.body.text,
    }
  }, { new : true });
  
  res.status(200).json(updatedOrder);
});
