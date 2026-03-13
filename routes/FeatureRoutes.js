const FeatureRouter = require("express").Router();
const {
  authAdmin,
  authPublic,
  authSuperAdmin,
} = require("../middlewares/authentication");

const {
  createRecord,
  getRecord,
  getSingleRecord,
  updateRecord,
  deleteRecord,
} = require("../controllers/FeatureController");

FeatureRouter.post("", authAdmin, createRecord);
FeatureRouter.get("", authPublic, getRecord);
FeatureRouter.get("/:_id", authPublic, getSingleRecord);
FeatureRouter.put("/:_id",authAdmin, updateRecord);
FeatureRouter.delete("/:_id",authSuperAdmin, deleteRecord);

module.exports = FeatureRouter;
