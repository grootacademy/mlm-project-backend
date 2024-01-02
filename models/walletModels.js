const mongoose = require("mongoose");

const walletSchema = mongoose.Schema({
    amount: {
        type: Number,
        default: 0
    },
    userRef: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("wallets", walletSchema);