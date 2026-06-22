import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";
import { multipleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/register").post(isAuthenticated,multipleUpload, registerCompany);
router.route("/get").get(isAuthenticated,getCompany);
router.route("/get/:id").get(isAuthenticated,getCompanyById);
router.route("/update/:id").put(isAuthenticated,multipleUpload,updateCompany);

export default router;