const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { registerProduct, getAllProducts } = require("../controllers/productControllers");
const r = express.Router();

r.route("/create").post(isAuthenticatedUser, authorizeRoles("admin"), registerProduct);
r.route("/getProducts").get(isAuthenticatedUser, getAllProducts);


module.exports = r;