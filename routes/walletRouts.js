const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { getuserWallets } = require("../controllers/walletControllers");
const r = express.Router();


r.route("/getuserWallet").get(isAuthenticatedUser,getuserWallets);


module.exports = r;