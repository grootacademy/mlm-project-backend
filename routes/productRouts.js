const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { registerProduct } = require("../controllers/productControllers");
const r = express.Router();

r.route("/create").post(isAuthenticatedUser, registerProduct);


module.exports = r;