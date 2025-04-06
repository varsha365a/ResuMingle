import express from "express";
import multer from "multer";
import path from "path";
import mongoose from "mongoose";
import { createPost, getAllPosts, addComment, checkJobCompatibility } from "../controller/PostController.js";
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

// DELETE: Delete a post
router.delete("/:postId", async (req, res) => {
    try {
        const postId = req.params.postId;
        
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
            return res.status(200).json({ hasPosted: true });
        } else {
            return res.status(200).json({ hasPosted: false });
        }
    } catch (error) {
        console.error("Error checking if user has posted:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/company-posts", authenticateUser, authenticateMember, async (req, res) => {
    try {
      const userCompany = req.user.company; // This should be populated from the JWT
      const posts = await Post.find({ company: userCompany }).populate("userId", "username");
      res.json(posts);
    } catch (error) {
      console.error("Error fetching member's company posts:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  router.put("/:id/like", async (req, res) => {
    try {
      const userId = req.user._id; // from auth middleware
      const post = await Post.findById(req.params.id);
  
      if (!post.likes.includes(userId)) {
        post.likes.push(userId);
        post.dislikes = post.dislikes.filter(id => id.toString() !== userId.toString());
      } else {
        post.likes = post.likes.filter(id => id.toString() !== userId.toString());
      }
  
      await post.save();
      res.status(200).json({ likes: post.likes, dislikes: post.dislikes });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put("/:id/dislike", async (req, res) => {
    try {
      const userId = req.user._id;
      const post = await Post.findById(req.params.id);
  
      if (!post.dislikes.includes(userId)) {
        post.dislikes.push(userId);
        post.likes = post.likes.filter(id => id.toString() !== userId.toString());
      } else {
        post.dislikes = post.dislikes.filter(id => id.toString() !== userId.toString());
      }
  
      await post.save();
      res.status(200).json({ likes: post.likes, dislikes: post.dislikes });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post("/:postId/comment", authenticateUser, addComment);
  

export const PostRouter = router;