const catchAsyncError = require("../middleware/catchAsyncError");
const { validationResult } = require("express-validator");
const Wallets = require("../models/walletModels");
const Membership = require("../models/membershipModels");
const ErrorHandler = require("../utils/ErrorHandler");


// get wallet for the current user
exports.getuserWallets = catchAsyncError(async (req, res, next) => {
    const { _id, name } = req.user;

    const wallets = await Wallets.findOne({ userRef: _id });

    if (!wallets) {
        return next(new ErrorHandler(`User ${name}'s wallet not found`, 404));
    }


    res.status(200).json({ success: true, data: wallets });
});