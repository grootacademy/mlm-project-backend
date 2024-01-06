const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { transactionHistory, withdrawalHistory, depositsHistory } = require("../controllers/depositControllers");
const r = express.Router();


r.route("/user/transactionHistory").get(isAuthenticatedUser, transactionHistory);

r.route("/found/withdrawalHistory").get(isAuthenticatedUser, withdrawalHistory);
r.route("/found/depositsHistory").get(isAuthenticatedUser, depositsHistory);

module.exports = r;