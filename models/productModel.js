const mongoose = require("mongoose");


const productSchema = mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    upiId: {
        type: String,
        required: [true, "Please enter your valid UPI ID"],
    },
    description: {
        type: String,
        required: [true, "Please enter your product description"],
    },
    adminRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

productSchema.path("upiId").validate((value) => {
    // Check if the length of the UPI ID is within the specified range
    const minUpiIdLength = 10;
    const maxUpiIdLength = 20;
    return value.length >= minUpiIdLength && value.length <= maxUpiIdLength;
}, "Invalid UPI ID");

module.exports = mongoose.model("products", productSchema);