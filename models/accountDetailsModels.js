const mongoose = require('mongoose');

const accountDetailsSchema = new mongoose.Schema({
    accountNumber: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    ifscCode: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
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



module.exports = mongoose.model('AccountDetails', accountDetailsSchema);