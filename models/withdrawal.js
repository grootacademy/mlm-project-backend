const mongoose = require("mongoose");

const withdrawalSchema = mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "users",
    },
    approvedOn: {
        type: Date,
    },
    approvedStatus: {
        type: String,
        default: "pending",
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("withdrawals", withdrawalSchema);