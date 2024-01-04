const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { body } = require("express-validator");
const { transactionHistory } = require("../controllers/depositControllers");
const r = express.Router();


r.route("/user/transactionHistory").get(isAuthenticatedUser, transactionHistory);

module.exports = r;