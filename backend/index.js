import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { UserRouter } from './routes/user.js';
import { PostRouter } from './routes/posts.js';
import { AdminRouter } from './routes/admin.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));
app.use(cookieParser());
app.use('/auth', UserRouter);
app.use('/api/posts', PostRouter);
app.use("/admin", AdminRouter);

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb://127.0.0.1:27017/resumingle')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.post('/api/posts', (req, res) => {
    const { company, role } = req.body;
    console.log(`Company: ${company}, Role: ${role}`);
    
    // Handle file and text saving to the database
    res.json({ message: "Resume uploaded successfully!" });
  });
  
app.use("/api/user", UserRouter);  

app.get("/uploads/:filename", (req, res) => {
    const filePath = path.join(__dirname, "uploads", req.params.filename);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    res.sendFile(filePath);
});