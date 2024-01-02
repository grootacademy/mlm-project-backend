const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require('validator');
const bcrypt = require("bcryptjs");

const membershipSchema = mongoose.Schema({
    referralCode: String,
    transactionId: {
        type: String,
        required: true,
        unique: true,
    },
    upiId: {
        type: String,
    },
    status: {
        type: String,
        default: "active",
    },
    approvedOn: {
        type: Date,
    },
    approvedStatus: {
        type: String,
        default: "Pending",
    },
    parentMembershipId: {
        type: mongoose.Types.ObjectId
    },
    userRef: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: true,
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: "products",
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },

});

module.exports = mongoose.model("memberships", membershipSchema);
