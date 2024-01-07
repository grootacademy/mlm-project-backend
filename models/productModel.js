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