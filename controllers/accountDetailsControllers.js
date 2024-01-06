const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const AccountDetails = require("../models/accountDetailsModels");

// create a new account
exports.AccountDetails = catchAsyncError(async (req, res, next) => {

    const { name, accountNumber, ifscCode, accountType, phone } = req.body;

})