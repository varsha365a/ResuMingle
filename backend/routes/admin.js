import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { Post } from "../models/Post.js";
import { addKeywords, getKeywordsByCompany } from "../controller/AdminController.js";


const router = express.Router();

router.get("/", authenticateUser, async (req, res) => {
    try {
        const admin = await User.findById(req.user.id).select("company username email");

        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        res.json(admin);
    } catch (error) {
        console.error("Error fetching admin data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/resumes", authenticateUser, async (req, res) => {
    try {
        const admin = await User.findById(req.user.id).select("company");

        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const resumes = await Post.find({ company: admin.company })
            .populate({
                path: "userId",
                select: "username email jobCompatibilityScore"
            })
            .lean();

        resumes.forEach(resume => {
            if (resume.userId && Array.isArray(resume.userId.jobCompatibilityScore)) {
                resume.userId.jobCompatibilityScore = resume.userId.jobCompatibilityScore.map(scoreObj => scoreObj.score);
            }
        });

        res.json(resumes);
    } catch (error) {
        console.error("Error fetching company resumes:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/add-keywords", addKeywords);
router.get("/keywords/:company", getKeywordsByCompany);
export const AdminRouter = router;
