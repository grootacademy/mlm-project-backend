const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server Error";


    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid:${err.path}`;
        err = new ErrorHandler(message, 400)
    }

    //mongoose duplicate key Error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

    //Wrong jwt Error
    if (err.name === "JsonWebTokenError") {
        const message = `wab token is invalid, Try again`;
        err = new ErrorHandler(message, 400)
    }

    //JWT Expire error
    if (err.name === "TokenExpiredError") {
        const message = `token is expirded,Try again`;
        err = new ErrorHandler(message, 400);
    };


    if (err.name === "ValidationError" && err.message.errors) {
        const errorKeys = Object.keys(err.message.errors);

        if (errorKeys.length > 0) {
            const firstErrorMessage = err.message.errors[errorKeys[0]].message;
            err = new ErrorHandler(firstErrorMessage, 400);
        } else {
            // Handle the case where there are no error keys
            err = new ErrorHandler("Validation error, but no specific error message found", 400);
        }
    };

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });

};