const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const { validationResult } = require("express-validator");
const Withdrawals = require("../models/withdrawalModels");
const Wallet = require("../models/walletModels");
const WalletModels = require("../models/walletModels");


//Request for withdrawal
exports.withdrawalRequest = catchAsyncError(async (req, res, next) => {
    const { _id } = req.user;

    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.send({ errors: result.array() });
    }

    const { amount } = req.body;

    const wallet = await WalletModels.findOne({ userRef: _id });

    if (!wallet) {
        return next(new ErrorHandler("Wallet not found", 404));
    };

    if (wallet.amount < amount) {
        return next(new ErrorHandler("Insufficient balance", 400));
    };

    let withdrawal = await Withdrawals.findOne({ createdBy: _id, approvedStatus: "Pending" });

    if (withdrawal) {

        return next(new ErrorHandler("Request already exist", 401));
    };

    withdrawal = await Withdrawals.create({
        amount: amount,
        createdBy: _id,
        approvedStatus: "Pending",
    });

    if (!withdrawal) {
        return next(new ErrorHandler("Withdrawal request not created", 401));
    };

    res.status(201).json(withdrawal);

});


//Approved request
exports.approveWithdrawal = catchAsyncError(async (req, res, next) => {

    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.send({ errors: result.array() });
    };

    const { withdrawalId } = req.body;

    let withdrawal;
    withdrawal = await Withdrawals.findOne({ _id: withdrawalId, approvedStatus: "Rejected" });

    if (withdrawal) {
        return next(new ErrorHandler("Request already Rejected", 400));
    };

    withdrawal = await Withdrawals.findOne({ _id: withdrawalId, approvedStatus: "Approved" });


    if (withdrawal) {
        return next(new ErrorHandler("Request already Approved", 400));
    };

    const newData = {
        approvedOn: Date.now(),
        approvedStatus: "Approved",
    };

    withdrawal = await Withdrawals.findByIdAndUpdate(withdrawalId, newData, { new: true });

    if (!withdrawal) {
        return next(new ErrorHandler("Withdrawal request not updated", 400));
    }

    const userRefId = withdrawal.createdBy;

    const iswallet = await Wallet.findOne({ userRef: userRefId });

    if (!iswallet) {
        return next(new ErrorHandler("Wallet not found", 404));
    };


    const newWalletDate = {
        amount: iswallet.amount - withdrawal.amount,
    }

    const wallet = await Wallet.findOneAndUpdate({ userRef: userRefId }, newWalletDate, { new: true });

    res.status(200).json({
        wallet
    });
});

// withdrawals request rejected (admin only)
exports.withdrawalRequestReject = catchAsyncError(async (req, res, next) => {

    const { _id } = req.user;

    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.send({ errors: result.array() });
    };

    const { withdrawalId } = req.body;

    let withdrawal;
    withdrawal = await Withdrawals.findOne({ _id: withdrawalId, approvedStatus: "Rejected" });

    if (withdrawal) {
        return next(new ErrorHandler("Request already Rejected", 400));
    };

    const newData = {
        approvedOn: Date.now(),
        approvedStatus: "Rejected",
    };

    withdrawal = await Withdrawals.findByIdAndUpdate(withdrawalId, newData, { new: true });

    if (!withdrawal) {
        return next(new ErrorHandler("Withdrawal request not updated", 400));
    };

    res.status(201).json({ withdrawal });

});


//get withdrawals list (admin only)
exports.getWithdrawalList = catchAsyncError(async (req, res, next) => {

    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.send({ errors: result.array() });
    };

    const { approvedStatus } = req.body;

    let filteredWithdrawals;
    let withdrawals;

    if (approvedStatus) {

        filteredWithdrawals = await Withdrawals.find({ approvedStatus: approvedStatus }).populate("createdBy", "name");

        if (filteredWithdrawals[0] === undefined) {

            return next(new ErrorHandler(`${approvedStatus} withdrawals note found`, 400));
        } else if (!filteredWithdrawals) {

            return next(new ErrorHandler(`withdrawals note found`, 400));
        }

    } else if (!approvedStatus) {

        withdrawals = await Withdrawals.find().populate("createdBy", "name");

        if (!withdrawals) {
            return next(new ErrorHandler("withdrawals note found", 400));
        };
    }

    res.status(200).json({
        success: true,
        data: withdrawals || filteredWithdrawals
    });

});


//withdrawals list panding request 
exports.withdrawalRequest = catchAsyncError(async (req, res, next) => {
    const { _id } = req.user;



    const walletModels = await Withdrawals.find({ approvedStatus: "Approved" })
});

