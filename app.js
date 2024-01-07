const express = require("express");
const cookieParser = require("cookie-parser");
const ErrorMiddleware = require("./middleware/Error");
const cors = require("cors");
const app = express();

app.use(cors({ origin: process.env.FRONTEND_URI, credentials: true }));
app.use(express.json());
app.use(cookieParser());

//Routes import
const user = require("./routes/userRouts");
const memberdhip = require("./routes/membershipRouts");
const Product = require("./routes/productRouts");
const Wallet = require("./routes/walletRouts");
const Withdrawal = require("./routes/withdrawalRouts");
const Deposit = require("./routes/depositRouts");
const AccountDetails = require("./routes/accountDetailsRoutes");
const Admin = require("./routes/adminRoutes");

app.use("/api/v1", user);
app.use("/api/v1", memberdhip);
app.use("/api/v1", Product);
app.use("/api/v1", Wallet);
app.use("/api/v1", Withdrawal);
app.use("/api/v1", Deposit);
app.use("/api/v1", AccountDetails);
app.use("/api/v1", Admin);

//Middleware for Error
app.use(ErrorMiddleware);

module.exports = app;