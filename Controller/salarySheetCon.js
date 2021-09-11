const salarySheet = require("../Model/salarySheet");
const userPro = require("../Model/userProDetailsModel");
const userPer = require("../Model/userPerDetails");

// FIND DATA OF EMPLOYEE
exports.findEmployeeSalarySheet = async (req, res) => {
  try {
    const showSalaryEmp = await salarySheet.findOne({
      emp_id: req.params.id,
    });
    const {
      emp_id,
      BasicSalary,
      TotalAllowances,
      TotalDeduction,
      NetSalary,
      DA,
      HRA,
      MA,
      PF,
      LIC,
      PTax,
      designation,
    } = showSalaryEmp;
    res.status(200).json({
      salarySheet: [
        {
          emp_id,
          designation,
          DA,
          HRA,
          MA,
          PF,
          LIC,
          PTax,
          BasicSalary,
          TotalAllowances,
          TotalDeduction,
          NetSalary,
        },
      ],
    });
  } catch (error) {
    res.status(404).json({
      message: `${req.params.id} not found!!!`,
    });
  }
};
//SAVE DATA
exports.postData = async (req, res) => {
  const emp_id = req.params.id;
  const isEmployeePro = await userPro.findOne({ emp_id: emp_id });
  const isEmployeePer = await userPer.findOne({ emp_id: emp_id });

  const { designation } = isEmployeePro;

  // check if empid exist in per and pro
  if (isEmployeePro) {
    try {
      const showSalaryEmp = await salarySheet.create({
        emp_id: req.params.id,
      });

      showSalaryEmp.calculateNetSalary(designation);
      await showSalaryEmp.save();

      const { emp_id } = showSalaryEmp;
      res.status(200).json({
        emp_id,
        showSalaryEmp,
        Message: "calculated and new added",
      });
    } catch (error) {
      res.json({
        message: "already created",
      });
    }
  }

  res.status(404).json({
    Message: `no employee of ${emp_id} found in per and pro!!!`,
  });
};

//PATCH
exports.patchData = async (req, res) => {
  const emp_id = req.params.id;
  const isEmployeePro = await userPro.findOne({ emp_id: emp_id });
  const isEmployeePer = await userPer.findOne({ emp_id: emp_id });
  const { designation } = isEmployeePro;
  if (isEmployeePro && isEmployeePer) {
    const isEmplyExist = await salarySheet.findOne({ emp_id: emp_id });
    console.log({ designation }, isEmplyExist.designation);
    let updated = isEmplyExist.calculateNetSalary(designation);
    await isEmplyExist.save();
    console.log(isEmplyExist);
  }
};

//DELETE
exports.deleteSalary = async (req, res) => {
  const emp_id = req.params.id;
  try {
    await salarySheet.findOneAndDelete({ emp_id: emp_id });
  } catch (error) {
    res.stat(404).json({
      message: `no salary record pertainig ${emp_id}`,
    });
  }
};
