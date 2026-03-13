const SettingRouter = require("express").Router();
const { settingUploader } = require("../middlewares/fileUploader");
const { createRecord, getRecord } = require("../controllers/SettingController");
const { authAdmin, authPublic } = require("../middlewares/authentication");

SettingRouter.post("",authAdmin,settingUploader.fields([{ name: "logoTop", maxCount: 1 },{ name: "logoBottom", maxCount: 1 },]),createRecord,);
SettingRouter.get("",authPublic, getRecord);

module.exports = SettingRouter;