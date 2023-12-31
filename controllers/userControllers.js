const catchAsyncError = require("../middleware/catchAsyncError");
const { validationResult } = require("express-validator");
const User = require("../models/userModels");
const Wallet = require("../models/walletModels");
const ErrorHandler = require("../utils/ErrorHandler");
const sendToken = require("../utils/jwtToken");
const Membership = require("../models/membershipModels");

//Register a user
exports.registerUser = catchAsyncError(async (req, res, next) => {

    const result = validationResult(req);

    if (!result.isEmpty()) {
        return next(new ErrorHandler(result.array()[0].msg, 400));
    }

    const { name, email, password, phone, upiId } = req.body;

    const existEmail = await User.findOne({ email: email.toLowerCase() });

    if (existEmail) {
        return next(new ErrorHandler("You can't use invalid or duplicate emails.", 409));
    }

    const existPhone = await User.findOne({ phone: phone });

    if (existPhone) {
        return next(new ErrorHandler("You can't use invalid or duplicate phone.", 409));
    }

    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        phone: phone,
        upiId: upiId,
    });

    await Wallet.create({
        userRef: user._id
    })

    sendToken(user, 201, res)
});

//Login user
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please enter Email and Password", 400));
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid Email & Password", 401));
    }

    const isComparePassword = await user.comparePassword(password);

    if (!isComparePassword) {
        return next(new ErrorHandler("Invalid Email & Password", 401));
    }

    sendToken(user, 200, res);
});

// get all users (admin only)
exports.getAllUsers = catchAsyncError(async (req, res, next) => {

    let users = await User.find().lean();

    // let totalMemberships = 0;
    //find perUser total memberships
    // await Promise.all(users.map(async (user, index) => {
    //     const totalMembershipsPerUser = await Membership.find({ userRef: user._id }).countDocuments();
    //     users[index].totalMemberships = totalMembershipsPerUser;
    //     totalMemberships += totalMembershipsPerUser;
    // }));

    res.status(200).json({
        success: true,
        users,
        // totalMemberships: totalMemberships
    });
});

// get user profile
exports.getUserProfile = catchAsyncError(async (req, res, next) => {

    const { _id } = req.user
    const user = await User.findById(_id).lean();
    user.totalMemberships = await Membership.find({ userRef: _id }).countDocuments();

    res.status(200).json({
        success: true,
        data: user
    });
});

//resat passwoard for user 
exports.resetPassword = catchAsyncError(async (req, res, next) => {

    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.send({ errors: result.array() });
    }

    const { _id } = req.user;

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(_id).select("+password");
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
        return next(new ErrorHandler("User current password does not match", 404));
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({ success: true, message: user.name });
});

//adit user profile
exports.aditUserProfile = catchAsyncError(async (req, res, next) => {
    const { _id } = req.user;

    const { name, upiId, email, phone } = req.body;

    const user = await User.findById(_id);

    console.log(user);

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    user.name = name;
    user.upiId = upiId;
    user.email = email;
    user.phone = phone;

    await user.save();

    res.status(201).json({
        success: true,
        data: user,
        message: "User details updated successfully",
    });
});

//logout user 
exports.logoutUser = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged out"
    });
});