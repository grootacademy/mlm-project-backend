const express = require("express");
const { requestMembership, approvalOfMembership, completeMembership, getAllMemberships, getAllMembershipsForAdmin, rejectMembership, getMembershipDetails, getUserMemberships, getSingalMembershipDetails } = require("../controllers/membershipControllers");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { body, param } = require("express-validator");
const r = express.Router();

const membershipRequest = [
    body("transactionId", "Please provide me a valid transactionId").isLength({ min: 5 }),
    body("product_id", "Please give me a valid product_id").isLength({ min: 8 }),
    body("parentReferralCode", "Please give me a valid parentReferralCode").optional().matches(/^[a-jA-J0-9]{10}$/),
]

const isMembershipId = [
    body("membershipId", "please enter the valid membershipId!").matches(/^[0-9a-fA-F]{24}$/)
];


const isApprovedStatus = [
    body("approvedStatus", "Please provide a valid approvedStatus").optional().isIn(["Pending", "Approved", "Rejected"])
];

const isParamsId = [
    param("id", "Please provide a valid ID in param").matches(/^[0-9a-fA-F]{24}$/),
]

r.route("/memberdhip/request").post(isAuthenticatedUser, membershipRequest, requestMembership);
r.route("/membership/approval").put(isAuthenticatedUser, authorizeRoles("admin"), isMembershipId, approvalOfMembership);
r.route("/membership/complete").put(isAuthenticatedUser, isMembershipId, completeMembership);

r.route("/membership/rejecte").put(isAuthenticatedUser, authorizeRoles("admin"), isMembershipId, rejectMembership);

r.route("/membership/getMemberships").get(isAuthenticatedUser, authorizeRoles("admin"), isApprovedStatus, getAllMembershipsForAdmin);

////////////////////////////////////////////////////////////////
r.route("/membership/getUserMemberships/:id").get(isAuthenticatedUser, authorizeRoles("admin"), isParamsId, getUserMemberships);
r.route("/membership/getSingalMembershipDetails/:id").get(isAuthenticatedUser, authorizeRoles("admin"), isParamsId, getSingalMembershipDetails)
////////////////////////////////////////////////////////////////

r.route("/memberships/user").get(isAuthenticatedUser, isApprovedStatus, getAllMemberships);
r.route("/membership/:id").get(isAuthenticatedUser, isApprovedStatus, getMembershipDetails);

module.exports = r;