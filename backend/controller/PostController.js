import { Post } from "../models/Post.js";

export const createPost = async (req, res) => {
    try {
        console.log("User in createPost:", req.user);
        const { text } = req.body;
        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({ error: "User ID missing from token" });
        }

        let pdfUrl = null;
        if (req.file) {
            pdfUrl = req.file.filename; 
        }
        
        const newPost = new Post({ userId, resumeText: text, pdfUrl });
        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Failed to create post" });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const userId = req.user.id; 

        const posts = await Post.find({ userId }).sort({ createdAt: -1 }); 

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
};  

export const likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: "Post not found" });

        const index = post.likes.indexOf(userId);
        if (index === -1) {
            post.likes.push(userId); 
        } else {
            post.likes.splice(index, 1);
        }

        await post.save();
        res.json({ success: true, likes: post.likes.length }); 
    } catch (error) {
        res.status(500).json({ error: "Failed to like/unlike post" });
    }
};


export const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { text } = req.body;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: "Post not found" });

        post.comments.push({ userId, text });
        await post.save();

        res.json(post);
    } catch (error) {
        res.status(500).json({ error: "Failed to add comment" });
    }
};

export const checkJobCompatibility = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);

        if (!post || !post.resumeText) {
            return res.status(404).json({ error: "Post or resume text not found" });
        }

        const jobKeywords = [
            "HTML", "CSS", "JavaScript", "React.js", "Vue.js", "Bootstrap", "Tailwind CSS",
            "Node.js", "Express.js", "SQL", "MongoDB", "PostgreSQL", "MySQL", "PHP", "Laravel",
            "MERN", "Git", "Full Stack Developer", "Full Stack", "Web Development", "Web Developer",
            "Cloud Computing", "Networking", "Debugging", "Version Control", "API Development",
            "Authentication", "Data Structures", "Algorithms", "Problem Solving", "Teamwork",
            "Agile Methodology", "C++", "Kotlin", "Dart", "Flutter", "Internship", "Hackathon",
            "E-Commerce", "Projects", "Software Development", "Software Engineer", "Database",
            "Coding", "Programming", "Computer Science", "Tech Quiz", "Bachelor of Science",
            "Responsive Design", "Microsoft Office", "Python", "Java", "Backend Development",
            "Frontend Development", "SDLC", "Web App", "App Development", "REST API",
            "Machine Learning", "Artificial Intelligence", "Data Analysis", "Scrum",
            "Cybersecurity", "Performance Optimization", "CI/CD", "Software Testing"
        ];

        const resumeText = post.resumeText.toLowerCase();
        let matches = 0;
        let matchedKeywords = new Set();

        jobKeywords.forEach((keyword) => {
            const safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters
            const regex = new RegExp(`\\b${safeKeyword.toLowerCase()}\\b`, "g");
            const found = resumeText.match(regex);
            if (found) {
                matches += found.length;
            }
        });
            
        const uniqueResumeWords = new Set(resumeText.split(/\s+/)).size;
        const compatibilityScore = Math.round((matches / uniqueResumeWords) * 100);

        res.json({ score: compatibilityScore, matchedKeywords: Array.from(matchedKeywords) });
    } catch (error) {
        console.error("Error checking job compatibility:", error);
        res.status(500).json({ error: "Failed to check job compatibility" });
    }
};     
