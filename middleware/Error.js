const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server Error";

    //mongoose duplicate key Error
    // if (err.code === 11000) {
    //     const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    //     err = new ErrorHandler(message, 400);
    // }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });

};