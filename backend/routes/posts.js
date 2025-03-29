import express from "express";
import multer from "multer";
import path from "path";
import mongoose from "mongoose";
import { createPost, getAllPosts, likePost, addComment, checkJobCompatibility } from "../controller/PostController.js";
import { authenticateUser, authenticateMember } from "../middleware/auth.js";
import { Post } from "../models/Post.js";    

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Serve uploaded PDFs correctly
router.use('/uploads', express.static('uploads'));

// Upload Resume (with company & role)
router.post("/", authenticateUser, upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const { text, company, role } = req.body;

        if (!company || !role) {
            return res.status(400).json({ error: "Company and Role are required" });
        }

        const pdfUrl = req.file.filename;

        const newPost = new Post({
            userId: req.user.id,
            resumeText: text || "",
            pdfUrl,
            company,
            role
        });

        await newPost.save();
        res.status(201).json({ message: "Resume uploaded successfully!", post: newPost });

    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Failed to create post" });
    }
});

// GET: Fetch all posts
router.get("/", authenticateUser, getAllPosts);

// PUT: Like a post
router.put("/:postId/like", authenticateUser, likePost);

// POST: Add a comment to a post
router.post("/:postId/comment", authenticateUser, addComment);

// DELETE: Delete a post
router.delete("/api/posts/:postId", async (req, res) => {
    try {
      const postId = req.params.postId;
  
      // Convert to MongoDB ObjectId if necessary
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ error: "Invalid post ID format" });
      }
  
      const deletedPost = await Post.findByIdAndDelete(postId);
  
      if (!deletedPost) {
        return res.status(404).json({ error: "Post not found" });
      }
  
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete post" });
    }
  });

// GET: Fetch member posts
router.get("/member-posts", authenticateUser, authenticateMember, async (req, res) => {
    try {
        const posts = await getAllPosts({ userId: req.user.id });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch member posts" });
    }
});

router.get("/:postId/compatibility", authenticateUser, checkJobCompatibility);

router.get("/has-posted", authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const post = await Post.findOne({ userId });
        if (post) {
            return res.json({ hasPosted: true });
        } else {
            return res.json({ hasPosted: false });
        }
    } catch (error) {
        console.error("Error checking if user has posted:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export const PostRouter = router;