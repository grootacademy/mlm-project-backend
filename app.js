const express = require("express");
const cookieParser = require("cookie-parser");
const ErrorMiddleware = require("./middleware/Error");
const app = express();
app.use(express.json());
app.use(cookieParser());

//Routes import
const user = require("./routes/userRouts");
const memberdhip = require("./routes/membershipRouts");
const Product = require("./routes/productRouts");
const Wallet = require("./routes/walletRouts");

app.use("/api/v1", user);
app.use("/api/v1", memberdhip);
app.use("/api/v1", Product);
app.use("/api/v1", Wallet);

//Middleware for Error
app.use(ErrorMiddleware);


module.exports = app;