import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
import { Keyword } from "../models/Keyword.js";

export const getCompanyResumes = async (req, res) => {
    try {
        // Fetch admin's company from the logged-in user
        const admin = await User.findById(req.user.id).select("company");
        if (!admin) return res.status(404).json({ error: "Admin not found" });

        // Get all applicants for this company
        const resumes = await Post.find({ company: admin.company })
            .populate({
                path: "userId",
                select: "username email jobCompatibilityScore"
            })
            .select("role pdfUrl")
            .lean();

        // Extract job compatibility scores
        resumes.forEach(resume => {
            if (resume.userId && Array.isArray(resume.userId.jobCompatibilityScore)) {
                resume.userId.jobCompatibilityScore = resume.userId.jobCompatibilityScore.map(scoreObj => scoreObj.score);
            }
        });

        console.log("Resumes Sent to Frontend:", resumes);
        res.json(resumes);
    } catch (error) {
        console.error("Error fetching company resumes:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const addKeywords = async (req, res) => {
    try {
        console.log("Received data:", req.body);
        const { company, role, keywords } = req.body;

        if (!company || !role || !keywords) {
            console.error("Missing fields:", { company, role, keywords });
            return res.status(400).json({ error: "Company, role, and keywords are required." });
        }

        const keywordArray = keywords.split(",").map((kw) => kw.trim());

        let companyKeywords = await Keyword.findOne({ company });

        if (companyKeywords) {
            // Check if role already exists
            const existingRole = companyKeywords.roles.find((r) => r.role === role);
            if (existingRole) {
                existingRole.keywords.push(...keywordArray);
            } else {
                companyKeywords.roles.push({ role, keywords: keywordArray });
            }
        } else {
            // Create a new document if the company doesn't exist in keywords collection
            companyKeywords = new Keyword({
                company,
                roles: [{ role, keywords: keywordArray }],
            });
        }

        await companyKeywords.save();
        res.status(201).json({ message: "Keywords added successfully." });
    } catch (error) {
        console.error("Error adding keywords:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

// Fetch all roles and their keywords for a company
export const getKeywordsByCompany = async (req, res) => {
    try {
        const { company } = req.params;

        const companyKeywords = await Keyword.findOne({ company });

        if (!companyKeywords) {
            return res.status(404).json({ message: "No keywords found for this company." });
        }

        res.json(companyKeywords.roles);
    } catch (error) {
        console.error("Error fetching keywords:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};