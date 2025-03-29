import { Post } from "../models/Post.js";
import { User } from "../models/User.js";

export const getCompanyResumes = async (req, res) => {
    try {
        const resumes = await Post.find()
            .populate({
                path: "userId",
                select: "username email jobCompatibilityScore"
            })
            .lean(); // Convert to plain JSON object

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
};


