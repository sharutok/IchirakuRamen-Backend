const express = require("express");
const {
  createUsers,
  allUsers,
  usersLogin,
  authAccess,
  deleteUsers,
  forgotPassword,
  verifyTokenAndUpdatePassword,
} = require("../Controller/UserLoginController");

const loginUsers = express.Router();
loginUsers.route("/signup").post(createUsers);
loginUsers.route("/login").post(usersLogin).get(authAccess, allUsers);
loginUsers.route("/login/:id").delete(authAccess, deleteUsers);
loginUsers.route("/passwordReset").post(forgotPassword);
loginUsers.route("/updatePassword").patch(verifyTokenAndUpdatePassword);

module.exports = loginUsers;
