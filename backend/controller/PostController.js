import { Post } from "../models/Post.js";
import path from 'path';
import fs from 'fs';

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
            pdfUrl = `/uploads/${req.file.filename}`;
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
        const posts = await Post.find().populate('userId', 'username');
        console.log("Successfully fetched posts"); 
        res.status(200).json(posts);
    } catch (error) {
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
        res.json(post);
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
