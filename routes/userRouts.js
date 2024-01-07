const express = require("express");
const { body } = require("express-validator");
const { registerUser, loginUser, logoutUser, getAllUsers, resetPassword, getUserProfile, aditUserProfile } = require("../controllers/userControllers");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const r = express.Router();

const isPasswoard = [
    body("currentPassword", "Please provide an 8-character valid password").isLength({ min: 8 }),
    body("newPassword", "Please provide an 8-character password").isLength({ min: 8 })
        .custom((value, { req }) => {
            if (value === req.body.currentPassword) {
                throw new Error("New password should not be the same as the current password");
            }
            return true;
        })
];

const isEmail = [
    body("email", "Please provide a valid email").isEmail()
];

r.route("/register").post(isEmail, registerUser);
r.route("/login").post(loginUser);
r.route("/logout").get(isAuthenticatedUser, logoutUser);
r.route("/password/reset").put(isAuthenticatedUser, isPasswoard, resetPassword);
r.route("/getAllUsers").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
r.route("/user/profile").get(isAuthenticatedUser, getUserProfile);
r.route("/user/update").put(isAuthenticatedUser, aditUserProfile);


module.exports = r