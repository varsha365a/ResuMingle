import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "Lax" });
    res.json({ message: "Login successful", user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
