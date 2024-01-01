const mongoose = require("mongoose");

const walletSchema = mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    userRef: {
        type: mongoose.Types.ObjectId,
        ref: "users",
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("wallets", walletSchema);