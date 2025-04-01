import express from 'express';
import bcrypt from 'bcrypt';
const router = express.Router();
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { saveCompatibilityScore } from "../controller/PostController.js";
import { authenticateUser } from "../middleware/auth.js";

router.post('/signup', async (req, res) => {
  const { username, email, company, password } = req.body;
  if (await User.findOne({ email })) return res.json({ message: "User already exists" });
  const newUser = new User({ username, email, company, password, role: "user" });
  await newUser.save();  
  return res.json({ status: true, message: "User registered successfully" });
});

router.post('/login', async (req, res) => {
  const { email, password, company } = req.body;
  try {
    const user = await User.findOne({ email, company });

    if (!user) {
      return res.status(404).json({ status: false, message: "User does not exist" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ status: false, message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, company: user.company, role: user.role },
      process.env.KEY,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, { httpOnly: true, maxAge: 3600000, sameSite: 'lax', secure: true });

    return res.status(200).json({ status: true, message: "User logged in successfully", role: user.role });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
        return res.json({ message: "User does not exist" });
    }

    const token = jwt.sign({ id: user._id }, process.env.KEY, { expiresIn: '5m' });

    //Nodemailer code
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
      
    var mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset password Link',
      text: `http://localhost:5173/resetPassword/${token}`
    };  
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        return res.json({ message: "Error sending message" });
      } else {
        return res.json ({ status: true, message: 'Email sent' });
      }
    });

  }catch (error) {
      alert(error);
  }
});

router.post('/resetPassword/:token', async(req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
      const decoded = await jwt.verify(token, process.env.KEY);
      const id = decoded.id;
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.findByIdAndUpdate({_id: id}, { password: hashedPassword });
      return res.json({ status: true, message: "Password reset successfully" });

  } catch (error) {
      return res.json({ message: "Expired or invalid link" });
  }
});

const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ status: false, message: "Access denied" });
    }
    const decoded = await jwt.verify(token, process.env.KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.json({ status: false, message: "Invalid token" });
  }
};

router.get('/verify', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.KEY);
    return res.json({ status: true, username: decoded.username });
  } catch (error) {
    return res.json({ status: false, message: "Invalid token" });
  }
});

router.post("/save-compatibility", authenticateUser, saveCompatibilityScore);

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ status: true, message: "User logged out successfully" });
});

router.get("/user", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the token
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ company: user.company });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch user scores
router.get("/scores", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the token
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Assuming `jobCompatibilityScore` is an array of scores in the User model
    res.status(200).json({ scores: user.jobCompatibilityScore });
  } catch (error) {
    console.error("Error fetching user scores:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as UserRouter };