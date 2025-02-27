import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { UserRouter } from './routes/user.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));
app.use(cookieParser());
app.use('/auth', UserRouter);

mongoose.connect('mongodb://127.0.0.1:27017/authentication')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
