const express = require("express");
const { requestMembership, approvalOfMembership, completeMembership } = require("../controllers/membershipControllers");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { body } = require("express-validator");
const r = express.Router();

const membershipRequest = [
    body("transactionId", "Please provide me a valid transactionId").isLength({ min: 5 }),
    body("product_id", "Please give me a valid product_id").isLength({ min: 8 }),
]

const isMembershipId = [
    body("membershipId", "please enter the valid membershipId!").matches(/^[0-9a-fA-F]{24}$/)
]

r.route("/memberdhip/request").post(isAuthenticatedUser, membershipRequest, requestMembership);
r.route("/membership/approval").put(isAuthenticatedUser, authorizeRoles("admin"), isMembershipId, approvalOfMembership);
r.route("/membership/complete").put(isAuthenticatedUser, isMembershipId, completeMembership);

module.exports = r;