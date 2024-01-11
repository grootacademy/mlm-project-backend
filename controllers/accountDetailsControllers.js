const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const AccountDetails = require("../models/accountDetailsModels");
const { validationResult } = require("express-validator");

// create a new user account
exports.submitteAccountDetails = catchAsyncError(async (req, res, next) => {

    const { _id } = req.user;

    const { name, accountNumber, ifscCode, accountType, bankName, branch, phoneNo } = req.body;

    const accountDetails = await AccountDetails.create({
        name,
        accountNumber,
        ifscCode,
        accountType,
        bankName,
        branch,
        phoneNo,
        createdBy: _id,
        createdOn: Date.now(),
    });

    res.status(201).json({
        success: true,
        data: accountDetails,
        message: "Account details submitted successfully"
    });
});

//update user account
exports.updateAccountDetails = catchAsyncError(async (req, res, next) => {

    const result = validationResult(req);

    if (!result.isEmpty()) {
        return next(new ErrorHandler(result.array()[0].msg, 400));
    }

    const { id } = req.params;

    const { name, accountNumber, ifscCode, accountType, bankName, branch, phoneNo } = req.body;

    let accountDetails = await AccountDetails.findOneAndUpdate({ _id: id }, {
        name,
        accountNumber,
        ifscCode,
        accountType,
        bankName,
        branch,
        phoneNo,
    }, { new: true });

    res.status(200).json({
        success: true,
        data: accountDetails,
        message: "Account details updated successfully"
    });
});

// user get account
exports.getAccount = catchAsyncError(async (req, res, next) => {
    const { _id } = req.user;

    const result = validationResult(req);

    if (!result.isEmpty()) {
        return next(new ErrorHandler(result.array()[0].msg, 400))
    }

    // const { id } = req.params;

    let account = await AccountDetails.find({ createdBy: _id });


    // if (id) {
    account = await AccountDetails.findOne({ _id: id });
    // }

    if (!account) {
        return next(new ErrorHandler("Account not found", 404));
    }

    res.status(200).json({
        success: true,
        data: account,
        message: "Account details retrieved successfully"
    });
});

//get all accounts (admin only)
exports.getAllAccounts = catchAsyncError(async (req, res, next) => {

    const result = validationResult(req);

    if (!result.isEmpty()) {
        return next(new ErrorHandler(result.array()[0].msg, 400));
    };

    const { id } = req.params;

    let accounts = await AccountDetails.find();

    if (id) {
        accounts = await AccountDetails.findOne({ _id: id });
    };

    if (!accounts) {
        return next(new ErrorHandler("Accounts not found", 404));
    };

    res.status(200).send({
        success: true,
        data: accounts,
        message: "Accounts retrieved successfully"
    });
});

// delete user account
exports.deleteAccountDetails = catchAsyncError(async (req, res, next) => {

});