const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorHandler = require("../utils/ErrorHandler");
const { generateReferralCode } = require("../utils/ReferralCode");
const Deposit = require("../models/depositModels");
const Withdrawal = require("../models/withdrawalModels");


//transaction history
exports.transactionHistory = catchAsyncError(async (req, res, next) => {
    const { _id } = req.user;

    let code = generateReferralCode()

    const deposits = await Deposit.find({ createdBy: _id });
    const withdrawal = await Withdrawal.find({ createdBy: _id });

    let transections = [...deposits, ...withdrawal];

    transections.sort((a, b) => new Date(a.createdOn) - new Date(b.createdOn));

    res.status(200).json({
        success: true,
        data: transections,
    });
});

//withdrawal history
exports.withdrawalHistory = catchAsyncError(async (req, res, next) => {
    const { _id } = req.user;

    const withdrawal = await Withdrawal.find({ createdBy: _id });

    if (!withdrawal) {
        return next(new ErrorHandler("Withdrawal history not found", 404));
    };

    res.status(200).json({
        success: true,
        data: withdrawal,
        message: "Withdrawal history found successfully",
    });
});

//deposits history
exports.depositsHistory = catchAsyncError(async (req, res, next) => {
    const { _id } = req.user;

    const deposits = await Deposit.find({ createdBy: _id });

    if (!deposits) {
        return next(new ErrorHandler("Deposit history not found", 404));
    };

    res.status(200).json({
        success: true,
        data: deposits,
        message: "Deposit history found successfully",
    });
});