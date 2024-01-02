const catchAsyncError = require("../middleware/catchAsyncError");
const Membership = require("../models/membershipModels");
const ErrorHandler = require("../utils/ErrorHandler");
const Product = require("../models/productModel");
const User = require("../models/userModels");

//register product
exports.registerProduct = catchAsyncError(async (req, res, next) => {
    const { _id } = req.user
    const { amount, duration } = req.body;

    const existProduct = await Product.find({ amount: amount });

    if (existProduct.length > 0 && existProduct[0].amount == amount) {
        return next(new ErrorHandler(`You are creating a duplicate product`, 400))
    }

    const product = await Product.create({
        amount: amount,
        duration: duration,
        adminRef: _id,
    });

    res.status(200).json({
        product
    });
});


//get all products
exports.getAllProducts = catchAsyncError(async(req,res,next)=>{
    
    const products = await Product.find();
    res.status(200).json({
        products
    });

});
