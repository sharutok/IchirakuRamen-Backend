const {
  createProDetails,
  displayProdetails,
  createPreDetails,
  displayPerdetails,
  finaldetails,
  deleteEmployee,
  updateEmployee,
} = require("../Controller/UserProDetailsCon");
const express = require("express");

const proDetails = express.Router();
proDetails.route("/pro").post(createProDetails).get(displayProdetails);
proDetails.route("/per").post(createPreDetails).get(displayPerdetails);
proDetails.route("/:id").get(finaldetails).patch(updateEmployee);
proDetails.route("/deleteemployee/:id").delete(deleteEmployee);

module.exports = proDetails;
