const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { registerProduct, getAllProducts, updateProduct, deleteProduct } = require("../controllers/productControllers");
const { param } = require("express-validator");
const r = express.Router();

const isParamsId = [
    param("id", "Please provide a valid ID in param").matches(/^[0-9a-fA-F]{24}$/),
]

r.route("/create").post(isAuthenticatedUser, authorizeRoles("admin"), registerProduct);
r.route("/getProducts").get(getAllProducts);

r.route("/product/update/:id").put(isAuthenticatedUser, authorizeRoles("admin"), isParamsId, updateProduct);
r.route("/product/delete/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), isParamsId, deleteProduct);


module.exports = r;