import { Post } from "../models/Post.js";
import { User } from "../models/User.js";

export const getCompanyResumes = async (req, res) => {
    try {
        const resumes = await Post.find().populate("userId", "username email"); // Get user details
        res.json(resumes);
    } catch (error) {
        console.error("Error fetching company resumes:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


