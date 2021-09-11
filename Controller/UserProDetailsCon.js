const userPro = require("../Model/userProDetailsModel");
const userPer = require("../Model/userPerDetails");
const { findById } = require("../Model/userProDetailsModel");

let sendEmpIdToPersonalProfile;
//--------------------PROFFESIONAL DETAILS--------------------------
//CREATE USER EMPLOYEE
exports.createProDetails = async (req, res) => {
  const proUser = await userPro.create({
    emp_id: req.body.emp_id,
    emp_type: req.body.emp_type,
    emp_email_id: req.body.emp_email_id,
    designation: req.body.designation,
    department: req.body.department,
    pf_acc_no: req.body.pf_acc_no,
    doj: req.body.doj,
    pay_date: req.body.pay_date,
    bank_info: req.body.bank_info,
    location: req.body.location,
  });
  res.status(200).json({
    status: 200,
    result: "ok",
    data: {
      proUser,
    },
  });
  console.log("in Pro" + proUser.emp_id);
  sendEmpIdToPersonalProfile = proUser.emp_id;
};

//SEE ALL EMPLOYEE
exports.displayProdetails = async (req, res) => {
  const user = await userPro.find();
  res.status(200).json({
    status: 200,
    result: user.length,
    data: {
      user,
    },
  });
};
//-----------------------------PERSONAL DETAILS-----------------------------

//CREATE USER EMPLOYEE
exports.createPreDetails = async (req, res) => {
  try {
    console.log({ sendEmpIdToPersonalProfile });
    const user = await userPer.create({
      emp_id: sendEmpIdToPersonalProfile,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      gender: req.body.gender,
      fathers_name: req.body.fathers_name,
      dob: req.body.dob,
      state: req.body.state,
      address: req.body.address,
      mobile_no: req.body.mobile_no,
      marital_status: req.body.marital_status,
    });
    res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

//SEE ALL EMPLOYEE

exports.displayPerdetails = async (req, res) => {
  try {
    const user = await userPer.find();

    res.status(200).json({
      result: user.length,
      user,
    });
  } catch (err) {
    console.log({ err });
  }
};

//SEE BOTH PRO AND PER DETAILS

exports.finaldetails = async (req, res) => {
  try {
    const proDetails = await userPro
      .findOne({ emp_id: req.params.id })
      .select("-emp_id -__v");
    const perDetails = await userPer
      .findOne({ emp_id: req.params.id })
      .select("-emp_id -__v");

    res.status(200).json({
      data: {
        Employee_ID: req.params.id * 1,
        details: [
          {
            proDetails,
            perDetails,
          },
        ],
      },
    });
  } catch (error) {
    console.log({ error });
  }
};

//DELETE EMPLOYEE
exports.deleteEmployee = async (req, res) => {
  console.log(req.params.id);
  const emp_id = req.params.id;
  const empPer = await userPer.findOneAndDelete({ emp_id: emp_id });
  const empPro = await userPro.findOneAndDelete({ emp_id: emp_id });
  // console.log(emp_id);
  try {
    res.status(200).json({
      message: "ok",
    });
  } catch (error) {
    console.log(error);
  }
};

//UPDATE EMPLOYEE
exports.updateEmployee = async (req, res) => {
  req.params.id;

  // const findPer = await userPer.findOne({ emp_id: req.params.id });
  // const findPro = await userPro.findOne({ emp_id: req.params.id });

  const updatePer = await userPer.updateMany(
    { emp_id: req.params.id },
    {
      emp_id: req.params.id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      gender: req.body.gender,
      fathers_name: req.body.fathers_name,
      dob: req.body.dob,
      state: req.body.state,
      address: req.body.address,
      mobile_no: req.body.mobile_no,
      marital_status: req.body.marital_status,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  const updatePro = await userPro.updateMany(
    { emp_id: req.params.id },
    {
      emp_type: req.body.emp_type,
      emp_email_id: req.body.emp_email_id,
      designation: req.body.designation,
      department: req.body.department,
      pf_acc_no: req.body.pf_acc_no,
      doj: req.body.doj,
      pay_date: req.body.pay_date,
      bank_info: req.body.bank_info,
      location: req.body.location,
    },
    { new: true, runValidators: true }
  );
  res.json({
    // findPer,
    // findPro,
    updatePro,
    updatePer,
  });
};
