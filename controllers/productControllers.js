const catchAsyncError = require("../middleware/catchAsyncError");
const Membership = require("../models/membershipModels");
const ErrorHandler = require("../utils/ErrorHandler");
const Product = require("../models/productModel");
const User = require("../models/userModels");
const { validationResult } = require("express-validator");

//register product
exports.registerProduct = catchAsyncError(async (req, res, next) => {
    const { _id } = req.user
    const { amount, duration, name, upiId } = req.body;

    const existProduct = await Product.find({ amount: amount });

    if (existProduct.length > 0 && existProduct[0].amount == amount) {
        return next(new ErrorHandler(`You are creating a duplicate product`, 400))
    };

    const product = await Product.create({
        name: name,
        amount: amount,
        duration: duration,
        adminRef: _id,
        upiId: upiId,
    });

    res.status(200).json({
        product
    });
});

// Update product-- Admin
exports.updateProduct = catchAsyncError(async (req, res, next) => {

    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.send({ errors: result.array() });
    };

    let products = await Product.findById(req.params.id);

    if (!products) {
        return next(new ErrorHandler(`product not found of this Id:${req.params.id}`, 404));
    }
    products = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true, runValidators: true, useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        data: products
    });
});


//get all products
exports.getAllProducts = catchAsyncError(async (req, res, next) => {

    let products = await Product.find();

    products.sort((a, b) => a.amount - b.amount);

    res.status(200).json({
        products
    });

});

// Delete product-- Admin
exports.deleteProduct = catchAsyncError(async (req, res, next) => {

    const productId = req.params.id;

    const result = await Product.deleteOne({ _id: productId });

    if (result.deletedCount === 0) {
        return next(new ErrorHandler("product not found", 404));
    };

    res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
    });

});
