import express from "express";
import multer from "multer";
import { createPost, getAllPosts, likePost, addComment } from "../controller/PostController.js";
import { authenticateUser } from "../middleware/auth.js"; 

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.post("/", authenticateUser, upload.single('pdf'), createPost);        
router.get("/", getAllPosts);                          
router.put("/:postId/like", authenticateUser, likePost); 
router.post("/:postId/comment", authenticateUser, addComment); 

export const PostRouter = router;
