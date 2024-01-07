const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { adminInfo } = require("../controllers/adminInfoController");
const r = express.Router();

r.route("/adminDashboard").get(isAuthenticatedUser, authorizeRoles("admin"), adminInfo);

module.exports = r;