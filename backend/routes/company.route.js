import express from "express";
import {registerCompany} from "../controllers/company.controller.js";
import {getCompany} from "../controllers/company.controller.js";
import {getCompanyById} from "../controllers/company.controller.js";
import {updateCompany} from "../controllers/company.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/registerCompany").post(isAuthenticated,registerCompany);
router.route("/get").get(isAuthenticated,getCompany);
router.route("/get/:id").get(isAuthenticated,getCompanyById);
router.route("/update/:id").put(isAuthenticated,updateCompany);

export default router;