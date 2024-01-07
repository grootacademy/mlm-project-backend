const catchAsyncError = require("../middleware/catchAsyncError");
const Membership = require("../models/membershipModels");
const User = require("../models/userModels");


exports.adminInfo = catchAsyncError(async (req, res, next) => {

    let data = {}

    // get Total no. memberships 
    data.membershipCount = await Membership.find().countDocuments()

    // get Total No. of users
    data.userCount = await User.find().countDocuments()

    res.status(200).json(data);

})
