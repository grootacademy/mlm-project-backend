const express = require("express");
const { registerUser, loginUser, logoutUser } = require("../controllers/userControllers");
const { isAuthenticatedUser } = require("../middleware/auth");
const r = express.Router();


r.route("/register").post(isAuthenticatedUser, registerUser);
r.route("/login").post(loginUser);
r.route("/logout").get(logoutUser);


module.exports = r