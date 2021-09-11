const timeSheet = require("../Model/timeSheet");
const userPro = require("../Model/userProDetailsModel");

// SET EMPLOYEE VALUES
exports.timeManage = async (req, res) => {
  const findUser = await userPro.findOne({ emp_id: req.body.emp_id });
  if (!findUser) {
    res
      .status(404)
      .json({ message: `No Employee ID of ${req.body.emp_id} exists!!!! ` });
  } else {
    const findUserForTimeSheet = await timeSheet.findOne({
      emp_id: req.body.emp_id,
    });

    if (findUserForTimeSheet) {
      console.log("findUserForTimeSheet");
      console.log(
        parseInt(req.body.logout.slice(0, 2)) -
          parseInt(req.body.login.slice(0, 2))
      );

      const [total] = findUserForTimeSheet.returnTotalhr(
        req.body.login,
        req.body.logout
      );

      const update = await timeSheet.updateOne(
        { emp_id: req.body.emp_id },
        {
          $push: {
            login: req.body.login,
            date: req.body.date,
            logout: req.body.logout,
            total: total,
          },
        }
      );

      res.json({
        message: "updated",
        emp_id: req.body.emp_id,
      });
    } else {
      const newTime = await timeSheet.create({
        emp_id: req.body.emp_id,
        login: req.body.login,
        logout: req.body.logout,
        date: req.body.date,
      });
      res.json({
        message: "created",
      });

      console.log(error);
    }
  }
};

// GET EMPLOYEE DETAILS
exports.totalTime = async (req, res) => {
  let emp_id = req.params.id;
  const show = await timeSheet.findOne({ emp_id: emp_id });
  const sumOfHr = show.totalNoOfHr(show.total);
  const mm = show.whichMonth(show.date);

  await show.updateOne({ emp_id: emp_id }, { $set: { totalHr: sumOfHr } });
  const { login, logout, date, total, totalHr } = show;
  res.json({
    TimeSheet: [
      {
        emp_id,
        timedate: {
          month: mm,
          date,
          login,
          logout,
        },
        total,
        totalHr,
        days: show.date.length,
      },
    ],
  });
};

//DELETE EMPLOYEE
exports.deleteEmp = async (req, res) => {
  let emp_id = req.params.id;

  await timeSheet.findOneAndDelete({ emp_id: emp_id });
  res.json({
    message: `deleted ${emp_id}`,
  });
};
