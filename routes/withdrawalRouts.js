const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { withdrawalRequest, approveWithdrawal } = require("../controllers/withdrawalControllers.js");
const { body } = require("express-validator");

const r = express.Router();

const iswithdrawalRequest = [
    body("amount", "Amount should be at least Rs 1000").isLength({ min: 4 }),
    body("amount", "Amount should be in Number").isNumeric(),
    body("amount", "Please provide me a valid amount").exists()
];

const iswithdrawalApproveRequest = [
    body("withdrawalId", "Please provide a valid withdrawalId").matches(/^[0-9a-fA-F]{24}$/),
]

r.route("/withdrawal/request").post(isAuthenticatedUser, iswithdrawalRequest, withdrawalRequest);

r.route("/withdrawal/approve").put(isAuthenticatedUser, authorizeRoles("admin"), iswithdrawalApproveRequest, approveWithdrawal);

module.exports = r;