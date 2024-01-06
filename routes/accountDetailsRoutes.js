const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { submitteAccountDetails, updateAccountDetails, getAccount, getAllAccounts } = require("../controllers/accountDetailsControllers");
const { param } = require("express-validator");

const r = express.Router();

const isValidId = [
    param("id", "Please provide a valid ID in param").optional().matches(/^[0-9a-fA-F]{24}$/)
];

const requireId = [
    param("id", "Please provide a ID in param").exists(),
    param("id", "Please provide a valid ID in param").matches(/^[0-9a-fA-F]{24}$/)
];


r.route("/create/accountDetails").post(isAuthenticatedUser, submitteAccountDetails);
r.route("/account/update/:id").put(isAuthenticatedUser, requireId, updateAccountDetails);
r.route("/getAccount/:id?").get(isAuthenticatedUser, isValidId, getAccount);

r.route("/getAllAccounts/:id?").get(isAuthenticatedUser, authorizeRoles("admin"), isValidId, getAllAccounts);

module.exports = r;
