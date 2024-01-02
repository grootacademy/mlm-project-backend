const express = require("express");
const { registerUser, loginUser, logoutUser, getAllUsers } = require("../controllers/userControllers");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const r = express.Router();


r.route("/register").post(registerUser);
r.route("/login").post(loginUser);
r.route("/logout").get(isAuthenticatedUser, logoutUser);
r.route("/getAllUsers").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers)


module.exports = r