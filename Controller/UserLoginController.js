const users = require("../Model/userLoginModel");
const jwt = require("jsonwebtoken");
const sendEmail = require("../email");
const crypto = require("crypto");
const { findOneAndUpdate } = require("../Model/userLoginModel");
// CREATE NEW USERS
const userToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: process.env.JWT_EXPIRY_TIME,
  });
};
exports.createUsers = async (req, res) => {
  try {
    const newUsers = await users.create({
      username: req.body.username,
      email_id: req.body.email_id,
      password: req.body.password,
      role: req.body.role,
    });

    const token = userToken(newUsers._id);
    res.status(200).json({
      token,
      status: 200,
      result: "ok",
      data: {
        user: newUsers,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      message: "error",
    });
  }
};

// SEE ALL USERS
exports.allUsers = async (req, res) => {
  try {
    const findUsers = await users.find();
    res.status(200).json({
      status: 200,
      result: findUsers.length,
      data: {
        users: findUsers,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// LOGGING USERS
exports.usersLogin = async (req, res, next) => {
  try {
    const { email_id, password, username } = req.body;

    if (!email_id && !password && !username) {
      res.status(400).json({
        message: "Email-ID,Password,Username cannot be left empty",
      });
      next();
    }
    const loginatedUsers = await users
      .findOne({ email_id: email_id })
      .select("+password");

    const correctPassword = await loginatedUsers.checkPassword(
      password,
      loginatedUsers.password
    );

    if (
      !(
        email_id === loginatedUsers.email_id &&
        correctPassword &&
        username === loginatedUsers.username
      )
    ) {
      res.status(400).json({
        message: "Enter valid Email_id or Password",
      });
      next();
    }
    const token = userToken(loginatedUsers._id);
    res.status(200).json({
      message: "successfully logged in ",
      data: {
        token,
        login: loginatedUsers,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// generate TOKEN

exports.authAccess = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({
        message: "You are not logged in!..get logged in to get access....",
      });
    }
    const decoded = await jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const isUser = await users.findById(decoded.id);

    if (!isUser) {
      res.status(401).json({
        message: "user does not exist",
      });
    }
    authUsers = isUser;
    next();
  } catch (error) {
    res.status(401).json({
      message: "not autharized",
    });
  }
};

// DELETE USER

exports.deleteUsers = async (req, res, next) => {
  const restrictUsers = ["hr", "admin", "it"];
  // console.log(req.params.id);

  if (restrictUsers.includes(authUsers.role)) {
    const deletedUser = await users.findByIdAndDelete(req.params.id);
    next();
  } else {
    res.status(401).json({
      message: "unautharized user",
    });
  }
};

// SEND TOKEN TO EMAIL
exports.forgotPassword = async (req, res) => {
  try {
    const isUser = await users
      .findOne({ email_id: req.body.email_id })
      .select("+password");

    if (!isUser) {
      res.status(400).json({
        message: "no user exists",
      });
    }
    const sendToken = isUser.tokenForPasswordReset();
    console.log(sendToken);
    await isUser.save({ validateBeforeSave: false });

    await sendEmail({
      email: req.body.email_id,
      subject: "dummy subject",
      message: `your reset code is ${sendToken}`,
    });
    res.status(200).json({
      message: "password sent to your email",
      isUser: isUser,
    });
  } catch (err) {
    console.log(err);
  }
};

//VERIFY ACCESS CODE AND UPDATE PASSWORD

exports.verifyTokenAndUpdatePassword = async (req, res) => {
  try {
    const tempToken = req.body.access_code;
    if (!tempToken) {
      res.status(401).json({ message: "empty" });
    }
    const checkToken = crypto
      .createHash("sha256")
      .update(tempToken)
      .digest("hex");
    const FindToken = await users
      .findOne({
        tempTokenForPasswordReset: checkToken,
      })
      .select("+password");

    if (!FindToken) {
      res.status(401).json({ message: "something wrong 1 " });
    }

    if (!(FindToken.tempTokenForPasswordReset === checkToken)) {
      res.status(200).json({ message: "something wrong 2 " });
    }

    FindToken.password = req.body.password;
    FindToken.save();
    res.status(200).json({
      message: "password updated",
    });
  } catch (err) {
    console.log(err);
  }
};
