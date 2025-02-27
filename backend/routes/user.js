import express from 'express';
import bcrypt from 'bcrypt';
const router = express.Router();
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        return res.json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    return res.json({ status: true, message: "User registered successfully" });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.json({ message: "User does not exist" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ username: user.username }, process.env.KEY, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000, sameSite: 'None', secure: true });
    return res.json({ status: true, message: "User logged in successfully" });
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
              user: 'catjasmine810@gmail.com',
              pass: 'jquq lsya owng twho'
            }
          });
          
          var mailOptions = {
            from: 'catjasmine810@gmail.com',
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
    try{
    const token = req.cookies.token;
    if (!token) {
        return res.json({ status: false, message: "Access denied" });
    }
    const decoded =await jwt.verify(token, process.env.KEY);
    next()

    } catch (error) {
      return res.json(error);
    }
  };

  router.get('/verify',verifyUser, (req, res) => {
    return res.json({ status: true, message: "User verified"})
  });

  router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ status: true })
  })

export { router as UserRouter };