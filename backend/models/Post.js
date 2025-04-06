import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resumeText: {
        type: String,
        required: true
    },
    pdfUrl: {
        type: String
    },
    company: {
        type: String,  // Add company field
        required: true
    },
    role: {
        type: String, 
        required: true
    },
    likes: {
        type: [String],
        default: [],
      },
    dislikes: {
        type: [String],
        default: [],
      },
      comments: {
        type: [
          {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            comment: String,
            createdAt: { type: Date, default: Date.now },
          }
        ],
        default: [],
      },
});

export const Post = mongoose.model('Post', postSchema);
