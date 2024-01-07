const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require('validator');
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: [true, "Please enter your name"],
        maxLength: [30, "name cannot exceed 30 characters"],
        minLength: [2, "name should have more than and equalsto 2 characters"]
    },
    upiId: {
        type: String,
        required: [true, "Please enter your UPI ID"],
    },
    email: {
        type: String,
        required: [true, "Please enter the Email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid Email"]
    },
    email: {
        type: String,
        required: [true, "Please enter the Email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false,
    },
    phone: {
        type: Number,
        unique: false,
    },
    role: {
        type: String,
        default: "user",
    },
    token: String,
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.path("upiId").validate((value) => {
    // Define a regular expression pattern for UPI ID
    var pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]+$/;
    return pattern.test(value);
}, "Invalid UPI ID");

userSchema.path('phone').validate(function (value) {
    return value > 999999999 && value < 10000000000;
}, 'Invalid phone number');


userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
};

//compare password
userSchema.methods.comparePassword = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
};

module.exports = mongoose.model("users", userSchema);