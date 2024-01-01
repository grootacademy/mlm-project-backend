const catchAsyncError = require("../middleware/catchAsyncError");
const { genretReferralCode } = require("../utils/ReferralCode");
const { validationResult } = require("express-validator");
const Membership = require("../models/membershipModels");
const ErrorHandler = require("../utils/ErrorHandler");
const Product = require("../models/productModel");
const User = require("../models/userModels");
const { calculateDaysElapsed } = require("../utils/timeElapsed");
const Deposit = require("../models/deposit");
const deposit = require("../models/deposit");
const Wallet = require("../models/wallet");
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
        } else {
            return next(new ErrorHandler("invalid refral code", 400));
        }
    }

    const code = genretReferralCode();

    const membership = await Membership.create({
        transactionId: transactionId,
        upiId: upiId,
        parentMembershipId: MembershipId,
        userRef: _id,
        product: product_id,
        // referralCode: code
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

    let membership = await Membership.findById(membershipId).select("approvedStatus");

    // Check if membership already approved or rejected
    if (membership.approvedStatus === "Approved") {
        return next(new ErrorHandler(`Membership already approved`, 400));
    }
    if (membership.approvedStatus === "Rejected") {
        return next(new ErrorHandler(`Membership already Rejected`, 400));
    }

    membership = await Membership.findByIdAndUpdate(membershipId, newdata, { new: true });

    if (!membership) {
        return next(new ErrorHandler(`Membership not found this Id: ${membershipId}`, 404));
    }

    res.status(201).json({
        membership
    });
});

//Complete membership
exports.completeMembership = catchAsyncError(async (req, res, next) => {

    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.send({ errors: result.array() });
    }

    const { _id } = req.user;

    const { membershipId } = req.body;

    const membership = await Membership.findById(membershipId).populate("product");

    // membership should exists.
    if (!membership) {
        return next(new ErrorHandler(`Membership not found this Id: ${membershipId}`, 404));
    };

    // Check if memeber ship is completed or not.
    if (membership.status === "complete") {
        return next(new ErrorHandler(`Membership already complete`, 404));
    };

    // user can only complete his own membership.
    if (!membership.userRef.equals(_id)) {
        return next(new ErrorHandler(`you can only complete your own membership`, 401));
    };

    // Calculate Earned amount of membership
    const EA = await earnedAmount(membershipId)

    // Calculate time elapsed since its creation.
    const daysElpsed = calculateDaysElapsed(membership.createdOn)

    if (EA === 0) {
        return next(new ErrorHandler(`You have not added any membership under you so you can not complete this membership`, 401));
    }

    // can not complete membership because earned amount is less then product amount and days passed are less then product duration
    if (EA < membership.product.amount && daysElpsed < membership.product.duration) {
        return next(new ErrorHandler(`You can not complete this membership because your earned amount is less then product amount and days passed are less then product duration`, 401));
    }

    await Membership.findByIdAndUpdate(membershipId, { status: "complete", referralCode: null })

    // Calculate Total amount
    let totalAmount = EA + membership.product.amount;

    // Add bonus amount
    if (EA >= membership.product.amount) {
        totalAmount += membership.product.amount
    }

    let wallet = await Wallet.findOne({ userRef: _id });

    // Create a deposit history.
    await Deposit.create({
        totalAmount: totalAmount,
        createdBy: _id,
        source: "membership",
        sourceId: membershipId,
        walletId: wallet._id
    })

    // Increase total amount in wallet.
    await Wallet.findByIdAndUpdate(wallet._id, { amount: wallet.amount + totalAmount })

    res.status(201).json({
        membership
    });
});

async function earnedAmount(membershipId) {
    // we are assuming this membership exists
    const memberships = await Membership.find({ parentMembershipId: membershipId, approvedStatus: "Approved" }).populate("product");
    if (memberships.length === 0) {
        return 0;
    }

    let earnedAmount = 0;

    memberships?.forEach(membership => {
        earnedAmount += membership?.product?.amount * 0.25;
    })

    return earnedAmount;
}
