import express from "express";
import { getCompanyResumes } from "../controller/AdminController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

router.get("/resumes", authenticateUser, getCompanyResumes);

export const AdminRouter = router;
