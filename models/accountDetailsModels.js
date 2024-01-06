const mongoose = require('mongoose');

const accountDetailsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a valid user name"],
    },
    accountNumber: {
        type: String,
        required: [true, "number is required"],
    },
    bankName: {
        type: String,
        required: [true, "Please provide a valid bankName"],
    },
    branch: {
        type: String,
        required: [true, "Please provide a valid branch"],
    },
    ifscCode: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: [true, "number is required"],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
});

accountDetailsSchema.path("ifscCode").validate((ifscCode) => {
    const ifscRegex = /^[A-Z]{4}[0][0-9]{6}$/;
    return ifscRegex.test(ifscCode);
}, "Invalid IFSC-code");

accountDetailsSchema.path("accountNumber").validate((accountNumber) => {
    const accountRegex = /^[0-9]{8,20}$/;
    return accountRegex.test(accountNumber);
}, "Invalid account number");



module.exports = mongoose.model('AccountDetails', accountDetailsSchema);