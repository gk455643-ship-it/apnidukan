const UserRouter = require("express").Router();
const {
  authBuyer,
  authPublic
} = require("../middlewares/authentication");
const {
  createRecord,
  getRecord,
  getSingleRecord,
  updateRecord,
  deleteRecord,
  login,
  forgetPassword1,
  forgetPassword2,
  forgetPassword3,
} = require("../controllers/UserController");

UserRouter.post("/login",authPublic, login);
UserRouter.post("/forget-password-1",authPublic, forgetPassword1);
UserRouter.post("/forget-password-2",authPublic, forgetPassword2);
UserRouter.post("/forget-password-3",authPublic, forgetPassword3);

UserRouter.post("", authPublic, createRecord);
UserRouter.get("",authBuyer, getRecord);
UserRouter.get("/:_id",authBuyer, getSingleRecord);
UserRouter.put("/:_id",authBuyer, updateRecord);
UserRouter.delete("/:_id",authBuyer, deleteRecord);

module.exports = UserRouter;
