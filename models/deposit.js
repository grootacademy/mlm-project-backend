const mongoose = require("mongoose");

const depositSchema = mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "users",
    },
    source: String,
    sourceId: {
        type: mongoose.Types.ObjectId,
        ref: "memberships"
    },
    walletId: {
        type: mongoose.Types.ObjectId,
        ref: "wallets"
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("deposits", depositSchema);