const jwt = require("jsonwebtoken");
const catchAsyncError = require("./catchAsyncError");
const User = require("../models/userModels");
const ErrorHandler = require("../utils/ErrorHandler");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;

    console.log("token", token)

    if (!token) {
        return next(new ErrorHandler("Please login to access this resource", 401))
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);

    next()
});


//authorizeRoles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (null == req?.user?.role) {
            return next(new ErrorHandler(`Bad request Please login`, 400));
        } else if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`RoleError: ${req.user.role} is note allowed to access this resorce`, 403));
        }
        next();
    };
};


