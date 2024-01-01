const catchAsyncError = require("../middleware/catchAsyncError");
const { genretReferralCode } = require("../utils/ReferralCode");
const { validationResult } = require("express-validator");
const Membership = require("../models/membershipModels");
const ErrorHandler = require("../utils/ErrorHandler");
const Product = require("../models/productModel");
const User = require("../models/userModels");
const ObjectId = require('mongodb').ObjectId;


//membership request
exports.requestMembership = catchAsyncError(async (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.send({ errors: result.array() });
    }

    const { _id } = req.user;
    const { transactionId, upiId, product_id, parentReferralCode } = req.body;

    const product = await Product.findById(product_id);

    if (!product) {
        return next(new ErrorHandler(`Product not found this Id:${product_id}`, 404));
    }

    let MembershipId;

    if (parentReferralCode) {
        const existmembership = await Membership.find({ referralCode: parentReferralCode });

        if (existmembership.length > 0) {

            MembershipId = existmembership[0]._id

            const userRefId = existmembership[0].userRef;

            if (userRefId.equals(_id)) {
                return next(new ErrorHandler(`Your parentReferralCode is not valid`, 409));
            }
        }
    }

    const code = genretReferralCode();

    const membership = await Membership.create({
        transactionId: transactionId,
        upiId: upiId,
        parentMembershipId: MembershipId,
        userRef: _id,
        product: product_id,
    });

    res.status(200).json({
        membership
    });
});


//Approval of membership
exports.approvalOfMembership = catchAsyncError(async (req, res, next) => {

    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.send({ errors: result.array() });
    }

    const { membershipId } = req.body;

    const code = genretReferralCode();
    const newdata = {
        referralCode: code,
        approvedStatus: "Approved",
        approvedOn: Date.now(),
    }

    const membership = await Membership.findByIdAndUpdate(membershipId, newdata, { new: true });

    if (!membership) {
        return next(new ErrorHandler(`Membership not found this Id:${membershipId}`, 404));
    }

    res.status(201).json({
        membership
    });
});

//complete membership
exports.completeMembership = catchAsyncError(async (req, res, next) => {

    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.send({ errors: result.array() });
    }

    const { _id } = req.user;

    const { membershipId } = req.body;

    const membership = await Membership.findById(membershipId);

    if (!membership) {
        return next(new ErrorHandler(`Membership not found this Id:${membershipId}`, 404));
    };

    if (!membership.userRef.equals(_id)) {
        return next(new ErrorHandler(`you are not applicable`, 401));
    };


    res.status(201).json({
        membership
    });
});



