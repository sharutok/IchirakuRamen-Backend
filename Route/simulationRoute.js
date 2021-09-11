const express = require("express");
const {
  timeManage,
  totalTime,
  deleteEmp,
} = require("../Controller/simulationCon");
const sim = express.Router();
sim.route("/timeSheet").post(timeManage);
sim.route("/timeSheet/:id").get(totalTime).delete(deleteEmp);
module.exports = sim;
