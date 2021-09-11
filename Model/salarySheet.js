const mongoose = require("mongoose");
const salarySheetSchema = new mongoose.Schema({
  emp_id: {
    type: String,
    required: [true, ""],
    unique: true,
  },
  designation: {
    type: String,
  },
  BasicSalary: {
    type: Number,
    default: 0,
    required: [true, ""],
  },
  DA: { type: Number, required: [true, ""], default: 0 },
  HRA: { type: Number, required: [true, ""], default: 0 },
  MA: { type: Number, required: [true, ""], default: 0 },
  PF: { type: Number, required: [true, ""], default: 0 },
  LIC: { type: Number, required: [true, ""], default: 0 },
  PTax: { type: Number, required: [true, ""], default: 0 },
  TotalAllowances: { type: Number, required: [true, ""], default: 0 },
  TotalDeduction: { type: Number, required: [true, ""], default: 0 },
  NetSalary: { type: Number, required: [true, ""], default: 0 },
});

salarySheetSchema.methods.calculateNetSalary = function (EmpDesignation) {
  const a = EmpDesignation;
  let arr = [];

  const designation = [
    "Head Chef",
    "Restaurant Manager",
    "Front Desk Manager",
    "Housekeeping Manager",
    "Kitchen Staff",
    "Room Service",
  ];
  const DA = [80, 60, 50, 40, 30, 20];
  const HRA = [50, 50, 50, 40, 40, 10];
  const MA = [30, 25, 20, 15, 10, 7];
  const PF = [25, 22, 18, 15, 12, 7];
  const LIC = [55, 51, 49, 45, 42, 39];
  const Ptax = [20, 16, 12, 10, 7, 5];
  const BasicSalary = [1500, 1000, 800, 700, 650, 500];
  const isThere = designation.includes(a);
  const whatIsIndex = designation.indexOf(a);

  const variables = [DA, HRA, MA, PF, LIC, Ptax, BasicSalary];
  variables.forEach((vari) => {
    arr = [...arr, vari[whatIsIndex]];
  });
  this.designation = EmpDesignation;
  this.DA = arr[0];
  this.HRA = arr[1];
  this.MA = arr[2];
  this.PF = arr[3];
  this.LIC = arr[4];
  this.PTax = arr[5];
  this.BasicSalary = arr[6];

  let allowances = arr.slice(0, 3);
  let deduction = arr.slice(3, 6);
  let baseSalary = arr.slice(6);
  baseSalary = baseSalary.reduce((a, b) => a + b, 0);
  allowances = (allowances.reduce((a, b) => a + b, 0) / 100) * baseSalary;
  deduction = (deduction.reduce((a, b) => a + b, 0) / 100) * baseSalary;
  const NetSalary = baseSalary + allowances - deduction;
  let EmpSalary = {
    allowances,
    deduction,
    baseSalary,
    NetSalary,
    DA: this.DA,
    HRA: this.HRA,
    MA: this.MA,
    PF: this.PF,
    LIC: this.LIC,
    Ptax: this.PTax,
    BasicSalary: this.BasicSalary,
  };
  this.TotalAllowances = allowances;
  this.TotalDeduction = deduction;
  this.NetSalary = NetSalary;
  return EmpSalary;
};

const salarySheet = mongoose.model("Salary-Sheet", salarySheetSchema);
module.exports = salarySheet;
