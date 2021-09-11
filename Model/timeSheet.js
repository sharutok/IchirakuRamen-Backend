const mongoose = require("mongoose");
const timeSheetSchema = new mongoose.Schema({
  emp_id: {
    type: Number,
    trim: true,
  },
  login: {
    type: [String],
    trim: true,
  },
  logout: {
    type: [String],
    trim: true,
  },
  date: {
    type: [String],
    trim: true,
  },
  total: {
    type: [Number],
  },
  totalHr: {
    type: Number,
  },
});

timeSheetSchema.pre("save", async function (next) {
  this.total =
    parseInt(this.logout.slice(0, 2)) - parseInt(this.login.slice(0, 2));
  // let today = new Date();
  // let dd = String(today.getDate()).padStart(2, "0");
  // let mm = String(today.getMonth() + 1).padStart(2, "0");
  // let yyyy = today.getFullYear();

  // today = mm + "-" + dd + "-" + yyyy;
  // this.date = today.slice(0, 10);

  next();
});
timeSheetSchema.methods.returnTotalhr = function (a, b) {
  this.total = parseInt(b.slice(0, 2)) - parseInt(a.slice(0, 2));
  return this.total;
};
timeSheetSchema.methods.totalNoOfHr = function (hr, date) {
  return (this.totalHr = hr.reduce((a, b) => a + b, 0));
};
timeSheetSchema.methods.whichMonth = function (mm) {
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const i = parseInt(mm[mm.length - 1].slice(5, 7));
  return month[i - 1];
};
const timeSheet = mongoose.model("Time-Sheet", timeSheetSchema);
module.exports = timeSheet;
