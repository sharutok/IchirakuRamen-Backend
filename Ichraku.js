const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const loginUsers = require("./Route/userLoginRoutes");
const proDetails = require("./Route/userProRoutes");
const simulation = require("./Route/simulationRoute");
const salaryRoute = require("./Route/salaryCalcRoute");
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/", loginUsers);
app.use("/details", proDetails);
app.use("/sim", simulation);
app.use("/ss", salaryRoute);
module.exports = app;
