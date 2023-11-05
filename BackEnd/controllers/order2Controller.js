const path=require("path");
const asyncHandler=require("express-async-handler");
const{validateCreateOrder2,validateUpdateOrder2, Order2}=require("../models/Order2");
const { User } = require("../models/User");


module.exports.createOrder2Ctrl = asyncHandler(async (req, res) => {
  const { error } = validateCreateOrder2(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const profile = await User.findById(req.user.id);

  const Order = await Order2.create({
    adress: req.body.adress,
    ville: req.body.ville,
    user: req.user.id,
    username: profile.username,
   
  });

  res.status(201).json(Order);
});