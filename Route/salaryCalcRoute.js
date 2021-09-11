const express = require("express");
const {
  postData,
  findEmployeeSalarySheet,
  patchData,
  deleteSalary,
} = require("../Controller/salarySheetCon");

const ss = express.Router();
ss.route("/calc/:id")
  .get(findEmployeeSalarySheet)
  .post(postData)
  .patch(patchData)
  .delete(deleteSalary);

module.exports = ss;
