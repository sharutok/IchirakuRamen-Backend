const mongoose = require("mongoose");
const { isAlpha, isAlphanumeric, isMobilePhone, isInt } = require("validator");
const usersPer = new mongoose.Schema({
  emp_id: {
    type: String,
    validate: [isInt, "only Numbers"],
    required: [true, ""],
    unique: true,
  },
  first_name: {
    type: String,
    unique: true,
    required: true,
    validate: [isAlpha, "only alpha"],
  },
  last_name: {
    type: String,
    required: true,
    validate: [isAlpha, "only alpha"],
  },

  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
  fathers_name: {
    type: String,
    required: true,
    validate: [isAlpha, "only alpha"],
  },
  dob: {
    type: Date,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  mobile_no: {
    type: Number,
    required: true,
  },
  marital_status: {
    type: String,
    enum: ["single", "married"],
    required: true,
  },
});
const userPer = mongoose.model("Personal_Details", usersPer);
module.exports = userPer;
