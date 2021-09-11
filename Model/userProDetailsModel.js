const mongoose = require("mongoose");
const { isEmail, isInt } = require("validator");
const usersPro = new mongoose.Schema({
  emp_id: {
    type: String,
    validate: [isInt, "only Numbers"],
    required: [true, ""],
    unique: true,
  },
  emp_type: {
    type: String,
    enum: ["Full Time", "Part Time", "Intern"],
    required: [true, ""],
  },
  emp_email_id: {
    type: String,
    validate: [isEmail, "enter correct email address"],
    required: [true, ""],
  },
  designation: {
    type: String,
    enum: [
      "Restaurant Manager",
      "Room Service",
      "Kitchen Staff",
      "Head Chef",
      "Front Desk Manager",
      "Housekeeping Manager",
    ],
    required: [true, ""],
  },
  department: {
    type: String,
    enum: [
      "Front Office Department",
      "Housekeeping Department",
      "Food and Beverage Service Department",
      "Kitchen or Food Production Department",
    ],
    required: [true, ""],
  },
  pf_acc_no: {
    type: String,
    required: [true, ""],
    validate: [isInt, "only Numbers"],
  },
  doj: { type: Date, required: [true, ""] },
  pay_date: { type: Date, required: [true, ""] },
  bank_info: { type: String, required: [true, ""] },
  location: {
    type: String,
    enum: ["Banglore", "Kerala", "Goa", "Pune", "Mumbai"],
    required: [true, ""],
  },
});
const userPro = mongoose.model("Professional_Details", usersPro);
module.exports = userPro;
