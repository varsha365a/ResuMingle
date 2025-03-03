import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.KEY);
        console.log("Decoded Token in Middleware:", decoded); // Log this
        req.user = decoded; // Attach user info
        next();
    } catch (error) {
        return res.status(403).json({ error: "Invalid token" });
    }
};


