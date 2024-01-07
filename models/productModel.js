const mongoose = require("mongoose");


const productSchema = mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        unique: true,
    },
    // duration: {
    //     type: Number,
    //     required: [true, "Please enter the product duration"],
    // },
    adminRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("products", productSchema);