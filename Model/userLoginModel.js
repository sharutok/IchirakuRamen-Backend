const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("mongoose-type-email");
const crypto = require("crypto");
const { isEmail, isStrongPassword, isAlpha } = require("validator");

const user = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      validate: [isAlpha, "Enter string containing only letters (a-zA-Z)."],
    },
    role: {
      type: String,
      enum: ["hr", "admin", "user", "it"],
    },
    email_id: {
      type: mongoose.SchemaTypes.Email,
      trim: true,
      lowercase: true,
      unique: true,
      validate: [isEmail, "Enter valid email "],
      required: [true, "Email-Id is a must"],
    },
    password: {
      trim: true,
      type: String,
      required: [true, "Password is a must"],
      minLenght: [12, "minimum length must be 12 characters...."],
      maxLength: [20, "exceded maximum length...."],
      validate: [isStrongPassword, "must contain 'a-z' 'A-Z' 'symbols' "],
      select: false,
    },
    loggedIn: {
      type: Date,
      default: new Date(),
    },
    tempTokenForPasswordReset: String,
    tokenExpiresIn: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
user.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

user.methods.tokenForPasswordReset = function (next) {
  const tempToken = crypto.randomBytes(2).toString("hex");

  this.tempTokenForPasswordReset = crypto
    .createHash("sha256")
    .update(tempToken)
    .digest("hex");
  this.tokenExpiresIn = Date.now();
  console.log({ tempToken }, this.tempTokenForPasswordReset);
  return tempToken;
};

user.methods.checkPassword = async function (hashedPassword, currentPassword) {
  return await bcrypt.compare(hashedPassword, currentPassword);
};

const users = mongoose.model("users", user);
module.exports = users;
